import sharp from 'sharp'

const resizeImage = async (buffer: Buffer) => {
     try {

      return await sharp(buffer)
      .resize({ width: 160, height: 160, fit: 'contain'})
      .toBuffer();
        
     } catch (error) {
        console.log(error)
     }
}

export { resizeImage };