const { v4: uuidv4 } = require("uuid");
const { socialMedia } = require("../models");
const BaseRepo = require("../core/baseRepo");
const { Op } = require("sequelize");
const Exception = require("../helpers/errorHelper");

class SocialMediaRepo extends BaseRepo {
    constructor() {
        super(socialMedia)
    }
    async addNewSocialMedia(fields, user_id, user_type) {
        return await this.create({
            userable_id: user_id,
            userable_type: user_type,
            facebook: fields.facebook,
            twitter: fields.twitter,
            linkedIn: fields.linkedIn,
            youtube: fields.youtube,
            aparat: fields.aparat,
            instagram: fields.instagram,
            telegram: fields.telegram,
            others: fields.others,
        })
    }
    async getByUserId(user_id, user_type) {
        return await this.findOrCreate({
            userable_id: user_id,
            userable_type: user_type,
        }, {})
    }
    async updateSocialMedia(id, fields) {
        const updateData = {}
        if (fields.facebook) updateData["facebook"] = fields.facebook
        if (fields.twitter) updateData["twitter"] = fields.twitter
        if (fields.linkedIn) updateData["linkedIn"] = fields.linkedIn
        if (fields.youtube) updateData["youtube"] = fields.youtube
        if (fields.aparat) updateData["aparat"] = fields.aparat
        if (fields.instagram) updateData["instagram"] = fields.instagram
        if (fields.telegram) updateData["telegram"] = fields.telegram
        if (fields.others) updateData["others"] = fields.others
        return await this.updateById(id, updateData)
    }
    async updateOrCreateByUserId(user_id, user_type, fields) {
        const updateData = {}
        if (fields.facebook) updateData["facebook"] = fields.facebook
        if (fields.twitter) updateData["twitter"] = fields.twitter
        if (fields.linkedIn) updateData["linkedIn"] = fields.linkedIn
        if (fields.youtube) updateData["youtube"] = fields.youtube
        if (fields.aparat) updateData["aparat"] = fields.aparat
        if (fields.instagram) updateData["instagram"] = fields.instagram
        if (fields.telegram) updateData["telegram"] = fields.telegram
        if (fields.others) updateData["others"] = fields.others

        return await this.updateOrCreate({
            userable_id: user_id,
            userable_type: user_type,
        }, updateData);
    }

}

module.exports = new SocialMediaRepo()
