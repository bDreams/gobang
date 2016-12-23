/**
 * @Author: bDreams
 * @Date:   2016-12-23T16:17:30+08:00
* @Last modified by:   bDreams
* @Last modified time: 2016-12-23T16:18:02+08:00
 */



function Gobang(ele, newEle, backEle, resultEle) {
    this.init(ele, newEle, backEle, resultEle);
}

Gobang.prototype = {
    init: function(ele, newEle, backEle, resultEle) {
        this.config = {
            ele: ele, // 存放棋盘容器
            newEle: newEle, // 重新开始
            back: backEle, // 悔棋
            resultEle: resultEle,
            GOBANG_BOARD_WIDTH: 12, // 棋盘横向放多少个棋子
            GOBANG_BOARD_HEIGHT: 12, // 棋盘纵向放多少个棋子
            PIECE_HEGHT: 40, // 每个棋子长度 （px）
            PIECE_WIDTH: 40 // 每个棋子宽度 （px）
        }
        this.piecesPos = [];
        this.player = false;
        this.gameOver = false;
        this.ele = document.querySelector(this.config.ele);
        this.backEle = document.querySelector(this.config.back);
        this.currentChess = null;
        this.createBoard();
        this.startAgain();
        this.back();
    },
    createBoard: function() { // 创建棋盘
        var bW = this.config.GOBANG_BOARD_WIDTH,
            bH = this.config.GOBANG_BOARD_WIDTH,
            pW = this.config.PIECE_WIDTH,
            pH = this.config.PIECE_HEGHT,
            i = 0,
            j = 0,
            piecesDom = [];

        for (; i < bH; i++) {
            for (j = 0; j < bW; j++) {
                var pos = {
                    x: j + 1,
                    y: i + 1
                };
                var x = (j + 1) < 10 ? '0' + (j + 1) : (j + 1) + '';
                var y = i + 1 < 10 ? '0' + (i + 1) : (i + 1) + '';
                var piece = '<i data-pos=' + x + y + '></i>';

                this.piecesPos.push(x + y);
                piecesDom.push(piece);
                if (j == bW - 1) {
                    piecesDom.push('<br/>');
                }
            }
        }
        this.ele.innerHTML = piecesDom.join('');
        this.playChess();
    },
    playChess: function() { // 落子
        var lis = this.lis = this.ele.querySelectorAll('i');
        var _this = this;

        for (var i = 0; i < lis.length; i++) {
            lis[i].index = i + 1;
            lis[i].onclick = function() {
                if (_this.gameOver) return;
                _this.isBlackOrRedChess(this);
            }
        }
    },
    isBlackOrRedChess: function(o) { // 判断落子应该为红子或者黑子
        var slice = [].slice;
        var isBlack = slice.call(o.classList).indexOf('black') == -1 ? true : false;
        var isRed = slice.call(o.classList).indexOf('white') == -1 ? true : false;
        if (!isBlack || !isRed) {
            return;
        }
        this.player ? o.classList.add('white') : o.classList.add('black');
        this.player = !this.player;
        var chess = this.player ? 'black' : 'white';

        this.currentChess = {
            index: this.getChess(o.dataset.pos),
            chess: chess
        };
        this.checkResult(o, chess);
    },
    checkResult: function(o, chess) { // 判断输赢
        var x = o.dataset.pos.substr(0, 2);
        var y = o.dataset.pos.substr(2);
        var pieces = this.piecesPos;
        var xArr = [],
            yArr = [];
        for (var i = 0; i < pieces.length; i++) {
            if (pieces[i].substr(2) == y) { // 横向
                xArr.push(this.getChess(pieces[i]));
            }
            if (pieces[i].substr(0, 2) == x) { // 纵向
                yArr.push(this.getChess(pieces[i]))
            }
        }

        var zArr = [],
            lArr = [];
        for (var j = 0; j < pieces.length; j++) { // 斜线
            var tempX = parseInt(pieces[j].substr(0, 2)),
                tempY = parseInt(pieces[j].substr(2));
            if (Math.abs(tempX - parseInt(x)) == Math.abs(tempY - parseInt(y))) {
                if (tempX === parseInt(x) && tempY === parseInt(y)) {
                    lArr.push(this.getChess(pieces[j]));
                }

                if ((tempX < parseInt(x) && tempY > parseInt(y)) || (tempX > parseInt(x) && tempY < parseInt(y))) {
                    lArr.push(this.getChess(pieces[j]));
                } else {
                    zArr.push(this.getChess(pieces[j]));
                }

            }
        }

        this.getResultXY(xArr, chess);
        this.getResultXY(yArr, chess);
        this.getResultXY(lArr, chess);
        this.getResultXY(zArr, chess);
    },

    getChess: function(pos) {
        var pieces = this.piecesPos,
            i = 0,
            len = pieces.length;
        for (; i < len; i++) {
            if (pos === pieces[i]) {
                return i;
            }
        }
        return -1;
    },
    getResultXY: function(arr, chess) { // 得到结果
        var count = 0;
        var slice = [].slice;
        for (var n = 0; n <= arr.length; n++) {
            if (count >= 5) {
                // alert(chess + '--win');
                document.querySelector(this.config.resultEle).value = chess == 'black' ? '黑棋胜' : '白棋胜';
                this.gameOver = true;
                this.backEle.setAttribute('disabled', 'disabled');
                break;
            }
            var index = arr[n];
            if (!index) return;
            if (slice.call(this.lis[index].classList).indexOf(chess) != -1) {
                count++;
            } else {
                count = 0;
            }
        }
    },
    startAgain: function() { // 重新开始
        document.querySelector(this.config.newEle).onclick = function() {
            window.location.reload();
        }
    },
    back: function() { // 悔棋
        var _this = this;
        this.backEle.onclick = function() {
            _this.lis[_this.currentChess.index].classList.remove(_this.currentChess.chess);
            _this.player = !_this.player;

        }
    }
};
new Gobang('#gobang', '#new_board', '#back_board', '#result');
