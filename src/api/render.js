import {
    IMAGE_URL
} from '@/api/api';

function renderImage(orig_data) {
    var data = {};
    var render_data = [];
    orig_data.forEach((v, i) => {
        data = {
            id: v[0],
            name: v[2],
            type: v[3],
            ext: v[4],
            size: v[5],
            pid: v[6],
            path: v[7],
            uuid: v[8],
            ctime: `${v[9].split(" ")[0]} ${v[9].split(" ")[1]}`,
            mtime: `${v[10].split(" ")[0]} ${v[10].split(" ")[1]}`,
            url: `${IMAGE_URL}/thumb/${v[8]}?id=${v[11]}`,
        };
        render_data.push(data);
    });
    return render_data;
}

function renderFile(orig_data) {
    var data = {};
    var render_data = [];
    orig_data.forEach((v, i) => {
        data = {
            id: v[0],
            name: v[2],
            type: v[3],
            ext: v[4],
            size: v[5],
            pid: v[6],
            path: v[7],
            uuid: v[8],
            ctime: `${v[9].split(" ")[0]} ${v[9].split(" ")[1]}`,
            mtime: `${v[10].split(" ")[0]} ${v[10].split(" ")[1]}`,
        };
        render_data.push(data);
    });
    return render_data;
}

function renderArticle(orig_data) {
    var data = {};
    var render_data = [];
    orig_data.forEach((v, i) => {
        data = {
            id: v[0],
            creator: v[1],
            uuid: v[2],
            name: v[6],
            title: v[7],
            desc: v[8],
            img: v[9],
            content: v[10],
            ctime: `${v[11].split(" ")[0]}`,
            mtime: `${v[12].split(" ")[0]}`,
            img_url: `${IMAGE_URL}/thumb/${v[9]}?id=${v[1]}`,
        };
        render_data.push(data);
    });
    return render_data;
}


function renderCard(orig_data, opt = {}) {
    var data = {};
    var render_data = [];
    orig_data.forEach((v, i) => {
        data = {
            id: v[0],
            creator: v[1],
            uuid: v[2],
            name: v[6],
            title: v[7],
            desc: v[8],
            img: v[9],
            link: v[10],
            ctime: `${v[11].split(" ")[0]}`,
            mtime: `${v[12].split(" ")[0]}`,
            img_url: `${IMAGE_URL}/thumb/${v[9]}?id=${v[1]}`,
            _opt: opt
        };
        render_data.push(data);
    });
    return render_data;
}

export {
    renderFile,
    renderImage,
    renderArticle,
    renderCard,
}