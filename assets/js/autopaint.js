var interval = 185000; //间隔时间，单位毫秒。
var positionX = 1012; //起点X坐标
var positionY = 190; //起点Y坐标
//图案，颜色请参考颜色表，'-'代表不做处理。
var pattern = '---------------BBBB---------------\n' +
              '--------------BB22BB--------------\n' +
              'BBBBBBBBBBBBBBB2222BBBBBBBBBBBBBBB\n' +
              'B22222B22222BB222222BB22BB2B22222B\n' +
              'BB22BBB22BB2B22222222B22BB2B22BBBB\n' +
              'BB22BBB22222B22222222B22BB2B2222BB\n' +
              'BB22BBB22B2BB22222222B22B2BB22BBBB\n' +
              'BB22BBB22BB2BB222222BBB22BBB22222B\n' +
              'BBBBBBBBBBBBBBB2222BBBBBBBBBBBBBBB\n' +
              '--------------BB22BB--------------\n' +
              '---------------BBBB---------------';

var colortable = { //颜色表
    0: '0,0,0', //黑色
    1: '255,255,255', //白色
    2: '252,222,107', //金色
    3: '255,246,209', //淡黄色
    4: '125,149,145', //灰绿色
    5: '113,190,214', //淡蓝色
    6: '59,229,219', //亮蓝色
    7: '254,211,199', //肉色 
    8: '184,63,39', //深红色
    9: '250,172,142', //淡橙色
    A: '0,70,112', //暗蓝色
    B: '5,113,151', //深蓝色
    C: '68,201,95', //绿色
    D: '119,84,255', //紫色
    E: '255,0,0', //红色
    F: '255,152,0', //橙色
    G: '151,253,220', //蓝绿色
    H: '248,203,140', //浅黄色
    I: '46,143,175' //蓝色
};

var id; //刻ID

function getColor(x, y) { //获取颜色。画板缩放必须为1X，否则会出现错误。如果一定要观察可以开启另一个没有运行脚本的窗口。
    var c = document.getElementById('drawing-canvas'), //获取画板
    ctx = c.getContext('2d'); //获取画板内容
    return ctx.getImageData(x, y, 1, 1); //获取指定像素颜色
}

function Draw(x, y, color) { //绘制
    var rgb = colortable[color].split(',');
    var imagedata = getColor(x, y).data;
    if (rgb[0]!=imagedata[0] || rgb[1]!=imagedata[1] || rgb[2]!=imagedata[2]) { //判断颜色是否不同，以免造成浪费。
        var formdata =  { //Form Data数据
            x_min : x,
            y_min : y,
            x_max : x,
            y_max : y,
            color : color
        };
        $.ajax('https://api.live.bilibili.com/activity/v1/SummerDraw/draw', { //发送POST
            method : 'POST',
            contentType:'application/x-www-form-urlencoded',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data : formdata,
            success : function(){},
            error : function(){}
        });
        return true;
    } else {
        return false;
    }
}

function Tick() { //每一刻的操作
    var success = false; //完成状态
    var row = pattern.split('\n'); //将图案分行
    for(var y in row) { //遍历行
        for(var x in row[y]) { //遍历字符
            var code = row[y][x]; //获取颜色代码
            if(code != '-') {
                var targetX = parseInt(positionX) + parseInt(x); //目标X坐标
                var targetY = parseInt(positionY) + parseInt(y); //目标Y坐标
                var success = Draw(targetX, targetY, code); //按照颜色进行绘制
                if(success) { //判断是否完成
                    console.log('已绘制' + x + ', ' + y + '代码为' + code + '的颜色' + '到' + targetX + ', ' + targetY);
                    break; //跳出循环
                }
            }
        }
        if(success) { //判断是否完成
            break; //跳出循环
        }
    }
    id = setTimeout('Tick()', interval); //一段时间后执行刻
}

function Reload() {
    clearTimeout(id); //取消下一个刻
    var d = document, s = d.getElementById('autopaint'); //获取脚本标签
    (d.head || d.body).removeChild(s); //移除脚本标签
    s = d.createElement('script'); //创建脚本标签
    s.src = 'https://it5z.github.io/assets/js/autopaint.js'; //设置脚本路径
    s.setAttribute("id", "autopaint"); //设置标签ID
    (d.head || d.body).appendChild(s); //增加标签
}

setTimeout('Reload', 900000); //一段时间后重载脚本
Tick(); //执行刻
