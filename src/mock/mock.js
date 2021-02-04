import Mock from "mockjs";

Mock.mock(RegExp('/api/files' + '.*'), 'post', {
    'data': {
        'path': '@cword(1,30)',
        'filelist|20-30': [{
            'id': '@id',
            'type': '@integer(1, 2)',
            'name': '@cword(1, 30).@word(1,3)',
            'ctime': '@datetime',
            'mtime': '@datetime',
            'url': '@url',
            'path': '@url',
            'size': '@integer(1,1000)KB',
        }],
        'next': '/files?p=@integer(1,999)'
    }
})

Mock.mock(RegExp('/api/cards' + '.*'), 'post', {
    'data': {
        'cardlist|5': [{
            'id': '@id',
            'title': '@cword(2, 30)',
            'text': '@cword(10, 50)',
            'link': '@url',
            'thumb': '@dataImage("48x48")',
            'image': '@dataImage()',
            'ctime': '@date',
            'mtime': '@date',
        }],
        'next': '/cards?p=@integer(1,999)'
    }
})

Mock.mock(RegExp('/api/articles' + '.*'), 'post', {
    'data': {
        'articlelist|5': [{
            'id': '@id',
            'title': '@cword(2, 30)',
            'text': '@cword(10, 50)',
            'link': '@url',
            'thumb': '@dataImage("48x48")',
            'image': '@dataImage("158x70", "未上传")',
            'ctime': '@date',
            'mtime': '@date',
        }],
        'next': '/articles?p=@integer(1,999)'
    }
})

Mock.mock(RegExp('/api/images' + '.*'), 'post', {
    'data': {
        'imageList|20': [{
            'id': '@id',
            'name': '@cword(1, 30)',
            'thumb': '@dataImage("158x70")',
            'image': '@dataImage()',
            'ctime': '@date',
            'mtime': '@date',
        }],
        'next': '/images?p=@integer(1,999)'
    }
})