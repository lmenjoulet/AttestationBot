let QRCode = require('qrcode');
let fs = require('fs');
const { PDFDocument, StandardFonts } = require('pdf-lib');
const fetch = require("node-fetch");

class Certificator{
    constructor(){
    }

    async generatePdf (user, reasons) {
        const pdfBase = fs.readFileSync("./ressources/certificate.pdf");
        const creationDate = getTodaysDate();
        const creationHour = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h');
        const { lastname, firstname, birthday, lieunaissance, address, zipcode, town} = user;
        const releaseHours = String(creationHour).substring(0,2);
        const releaseMinutes = String(creationHour).substring(3,5);
      
        const data = [
          `Cree le: ${creationDate} a ${creationHour}`,
          `Nom: ${lastname}`,
          `Prenom: ${firstname}`,
          `Naissance: ${birthday} a ${lieunaissance}`,
          `Adresse: ${address} ${zipcode} ${town}`,
          `Sortie: ${creationDate} a ${releaseHours}h${releaseMinutes}`,
          `Motifs: ${reasons}`,
        ].join('; ')
      
        const pdfDoc = await PDFDocument.load(pdfBase)
        const page1 = pdfDoc.getPages()[0]
      
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const drawText = (text, x, y, size = 11) => {
          page1.drawText(text, { x, y, size, font })
        }
      
        drawText(`${firstname} ${lastname}`, 123, 686)
        drawText(birthday, 123, 661)
        drawText(lieunaissance, 92, 638)
        drawText(`${address} ${zipcode} ${town}`, 134, 613)
      
        if (reasons.includes('travail')) {
          drawText('x', 76, 527, 19)
        }
        if (reasons.includes('courses')) {
          drawText('x', 76, 478, 19)
        }
        if (reasons.includes('sante')) {
          drawText('x', 76, 436, 19)
        }
        if (reasons.includes('famille')) {
          drawText('x', 76, 400, 19)
        }
        if (reasons.includes('sport')) {
          drawText('x', 76, 345, 19)
        }
        if (reasons.includes('judiciaire')) {
          drawText('x', 76, 298, 19)
        }
        if (reasons.includes('missions')) {
          drawText('x', 76, 260, 19)
        }
        let locationSize = idealFontSize(font, user.town, 83, 7, 11)
      
        drawText(user.town, 111, 226, locationSize)
      
        if (reasons !== '') {
          // Date sortie
          drawText(`${creationDate}`, 92, 200)
          drawText(releaseHours, 200, 201)
          drawText(releaseMinutes, 220, 201)
        }
      
        // Date création
        drawText('Date de création:', 464, 150, 7)
        drawText(`${creationDate} à ${creationHour}`, 455, 144, 7)
      
        const generatedQR = await generateQR(data)
      
        const qrImage = await pdfDoc.embedPng(generatedQR)
      
        page1.drawImage(qrImage, {
          x: page1.getWidth() - 170,
          y: 155,
          width: 100,
          height: 100,
        })
      
        pdfDoc.addPage()
        const page2 = pdfDoc.getPages()[1]
        page2.drawImage(qrImage, {
          x: 50,
          y: page2.getHeight() - 350,
          width: 300,
          height: 300,
        })
      
        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    }
}

function getTodaysDate(){
    const today_date = new Date();
    return `${today_date.getDate()}/${today_date.getMonth()+1}/${today_date.getFullYear()}`;
}

function idealFontSize (font, text, maxWidth, minSize, defaultSize) {
    let currentSize = defaultSize
    let textWidth = font.widthOfTextAtSize(text, defaultSize)
  
    while (textWidth > maxWidth && currentSize > minSize) {
      textWidth = font.widthOfTextAtSize(text, --currentSize)
    }
  
    return (textWidth > maxWidth) ? null : currentSize
}

async function generateQR(data) {
    try {
        var opts = {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
      }
      return await QRCode.toDataURL(data, opts)
    } 
    catch (err) {
        console.error(err)
    }
}

module.exports = Certificator;