const fs = require('fs');

module.exports.ChangeAvatar = {
    mutation: `changeAvatar(userId:String, userToken:String, userEmail:String, userLogin:String, file: Upload):String`,
    async resolve(parent, args) {
        console.log(args)
        const { userLogin } = args;
        const file = await args.file;
        const { createReadStream, filename } = file.file;
        const stream = createReadStream();

        await stream.pipe(fs.createWriteStream(`./public/img/users/${userLogin}.jpg`));

        return 'success';
    }
}
