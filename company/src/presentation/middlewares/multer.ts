import multer from 'multer';


const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });


export const feilds = [
    { name: 'companyDoc', maxCount: 1},
    { name: "ownerDoc",  maxCount: 1}
]