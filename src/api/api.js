import {
    http
} from "@/api/http";
import mock from "@/mock/mock";

const FILE_LIST = '/files';
const CARD_LIST = '/cards';
const IMAGE_LIST = '/images';

export {
    FILE_LIST,
    CARD_LIST,
    IMAGE_LIST,
}

export const getFiles = function () {
    return http.post(FILE_LIST)
}

export const getCards = function (params) {
    return http.post(`${CARD_LIST}?p=1`, params)
}

export const getImages = function (params) {
    return http.post(`${IMAGE_LIST}?p=1`, params)
}