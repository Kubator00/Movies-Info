const fs = require('fs');

module.exports.UploadFile = {
    mutation: `uploadFile(userId:String, userToken:String, userEmail:String, userLogin:String, file: Upload):String`,
    async resolve(parent, args) {
        console.log(args)
        const {userLogin} = args;
        const file = await args.file;
        const {createReadStream, filename} = file.file;
        const stream = createReadStream();

        await stream.pipe(fs.createWriteStream(`./public/img/users/${userLogin}.jpg`));

        return 'success';
    }
}
