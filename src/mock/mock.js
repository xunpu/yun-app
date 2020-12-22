import Mock from "mockjs";

Mock.mock('/api/files', 'post', {
    'path': '@cword(1,30)',
    'filelist|20-30': [{
        'id': '@id',
        'type': '@integer(1, 2)',
        'name': '@cword(1, 30).@word(1,3)',
        'ctime': '@datetime',
        'mtime': '@datetime',
        'url': '@url',
    }]
})