const Exception = require("../helpers/errorHelper");
const axios = require("axios");

module.exports.getAddressWithLatLong = async ({ lat, lon }) => {
    const axiosHeader = await axios.create({
        headers: {
            "x-api-key": process.env.ADDRESS_TOKEN
        }
    })

    await axiosHeader.get(`https://map.ir/reverse?lat=${lat}&lon=${lon}`)
        .then((res) => {
            this.result = {
                status: true,
                data: res.data
            }
        })
        .catch((e) => {
            this.error = {
                status: false
            }
        })

    return this.error || this.result
}