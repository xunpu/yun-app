import {
    http
} from "@/api/http";
import mock from "@/mock/mock";

export const getFiles = function () {
    return http.post('/files')
}