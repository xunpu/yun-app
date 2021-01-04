import {
    http
} from "@/api/http";
import mock from "@/mock/mock";

export const getFiles = function () {
    return http.post('/files')
}

export const getCards = function () {
    return http.post('/cards')
}