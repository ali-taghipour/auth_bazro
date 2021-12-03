const { v4: uuidv4 } = require("uuid");
const { user } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const { passwordHasher, checkPasswordBoolean } = require("../helpers/hash");
const Exception = require("../helpers/errorHelper");
const lastPasswordRepo = require("./lastPasswordRepo");
const Crypto = require("crypto");

class UserRepo extends BaseRepo {
    constructor() {
        super(user)
    }
    async checkUserIsAvailble(username, phone_number, email) {
        const user = await this.getOne({
            [Op.or]:
                [
                    { username: username },
                    { phone_number: phone_number },
                ],
        });
        if (user) {
            if (user.username == username) {
                throw Exception.setError("this username was taken before")
            } else if (user.phone_number == phone_number) {
                throw Exception.setError("this phone number was taken before")
            } else {
                throw Exception.setError("this email was taken before")
            }
        }
    }
    async addNewUser(fields) {
        const newPass = await passwordHasher(fields.password)
        const newUser = await this.create({
            id: uuidv4(),
            password: newPass,
            username: fields.username,
            phone_number: fields.phone_number,

            addresses: [{ userable_type: "user" }],
            companies: [{ userable_type: "user" }],
            info: { userable_type: "user" },
            socialMedia: { userable_type: "user" },
        }, {
            include: [user.addresses, user.companies, user.info, user.socialMedia]
        })
        await lastPasswordRepo.addNew(newUser.id, newPass);
        return newUser;
    }
    async getByIdWithRelations(id) {
        return await this.getById(id, {
            attributes: { exclude: ['password'] },
            include: [user.addresses, user.companies, user.info, user.socialMedia]
        })
    }

    async verifyEmail(user, verifyCode) {

        if (user.email_verify_token == null || user.email_verify_token != verifyCode) {
            return false;
        }

        user.email_verify_at = Date.now();
        await user.save();

        return user;

    }

    async updateUser(user, fields) {
        const updateObject = {}
        if (fields.username && fields.username != user.username) updateObject["username"] = fields.username

        if (fields.email && fields.email != user.email) {
            updateObject["email"] = fields.email
            updateObject["email_verify_at"] = null;
            updateObject["email_verify_token"] = Crypto.randomBytes(64).toString('hex');;
        }
        if (fields.phone_number && fields.phone_number != user.phone_number) updateObject["phone_number"] = fields.phone_number
        if (fields.password) {
            const isNewPassword = await checkPasswordBoolean(fields.password, user.password)
            if (isNewPassword) {
                const newPass = await passwordHasher(fields.password)
                await lastPasswordRepo.addNew(user.id, newPass);
                updateObject["password"] = newPass
            }
        }
        console.log(updateObject);

        return await this.updateById(user.id, updateObject)
    }

    async getByUsername(username) {
        return await this.getOne({ username: username })
    }
    async getByPhoneNumber(phone) {
        return await this.getOne({ phone_number: phone })
    }

    async updatePasswordById(id, password) {
        const newPass = await passwordHasher(password)
        await this.updateById(id, { password: newPass });
        await lastPasswordRepo.addNew(id, newPass);
    }

    async checkUserInfoIsAvailable(fields, user) {
        const filedArray = [];
        if (fields.username && fields.username != user.username)
            filedArray.push({ username: fields.username })
        if (fields.phone_number && fields.phone_number != user.phone_number)
            filedArray.push({ phone_number: fields.phone_number })
        if (fields.email && fields.email != user.email)
            filedArray.push({ email: fields.email })
        let condition = {}
        if (filedArray.length == 0) {
            return;
        }
        if (filedArray.length > 1) {
            condition = { [Op.or]: filedArray }
        } else {
            const filed = filedArray[0]
            condition = filed
        }
        const userFromDb = await this.getOne(condition);
        if (userFromDb) {
            if (fields.username && userFromDb.username == fields.username)
                throw Exception.setError("this username was taken before")
            if (fields.email && userFromDb.email == fields.email)
                throw Exception.setError("this email was taken before")
            if (fields.phone_number && userFromDb.phone_number == fields.phone_number)
                throw Exception.setError("this phone_number was taken before")
        }
    }
}

module.exports = new UserRepo()
