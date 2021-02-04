const getToken = async function () {
    var token = await new Promise((resolve, reject) => {
        uni.getStorage({
            key: "token",
            success: (res) => {
                resolve(res.data);
            }
        });   
    });
    return token;
}

const getPhone = async function () {
    var phone = await new Promise((resolve, reject) => {
        uni.getStorage({
            key: "phone",
            success: (res) => {
                resolve(res.data);
            }
        });   
    });
    return phone;
}

export {
    getToken,
    getPhone
}

