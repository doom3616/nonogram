/**
 * @author Owner
 */

//以下設定項目
var screenWidth = 320;
var usesMouseEvents = true;
var marginLeft = 10;
var marginRight = 10;
var marginTop = 10;
var marginBottom = 10;
var marginLeftOfInputArea = 5;
var marginTopOfInputArea = 5;
var marginBetweenInputAreaAndBottomArea = 10;
var marginBetweenBottomAreaAndButtonArea = 10;

//以下非設定項目
var touchstart;
var touchmove;
var touchend;
if (usesMouseEvents) {
	touchstart = "mousedown";
	touchmove = "mousemove";
	touchend = "mouseup";
} else {
	touchstart = "touchstart";
	touchmove = "touchmove";
	touchend = "touchend";
}

var mouseIsDown = false;

var Point = function(x, y) {
	this.x = x;
	this.y = y;
};

var upNumberColCount = inputColCount;
var upNumberRowCount = Math.ceil(inputRowCount / 2);
var leftNumberColCount = Math.ceil(inputColCount / 2);
var leftNumberRowCount = inputRowCount;

var inputCellWidth = Math.floor((screenWidth - marginLeft - marginRight - marginLeftOfInputArea) / (inputColCount + leftNumberColCount * (2 / 3)));
var inputCellHeight = inputCellWidth;
var upNumberCellWidth = inputCellWidth;
var upNumberCellHeight = Math.floor(inputCellHeight * (2 / 3));
var leftNumberCellWidth = Math.floor(inputCellWidth * (2 / 3));
var leftNumberCellHeight = inputCellHeight;

var logoAreaStartX = marginLeft;
var logoAreaStartY = marginTop;
var logoAreaWidth = leftNumberCellWidth * leftNumberColCount;
var logoAreaHeight = upNumberCellHeight * upNumberRowCount;

var upNumberAreaStartX = marginLeft + leftNumberCellWidth * leftNumberColCount + marginLeftOfInputArea;
var upNumberAreaStartY = marginTop;
var leftNumberAreaStartX = marginLeft;
var leftNumberAreaStartY = marginTop + upNumberCellHeight * upNumberRowCount + marginTopOfInputArea;

var inputAreaStartX = upNumberAreaStartX;
var inputAreaStartY = leftNumberAreaStartY;
var inputAreaWidth = inputCellWidth * inputColCount;
var inputAreaHeight = inputCellHeight * inputRowCount;

var bottomAreaHeight = inputCellHeight;
var bottomAreaWidth = screenWidth - marginLeft - marginRight;
var bottomAreaStartX = marginLeft;
var bottomAreaStartY = inputAreaStartY + inputAreaHeight + marginBetweenInputAreaAndBottomArea;

var mainScreenHeight = bottomAreaStartY + bottomAreaHeight + marginBetweenBottomAreaAndButtonArea;

var buttonAreaHeight = Math.floor(mainScreenHeight / 2);
var buttonAreaWidth = screenWidth - marginLeft - marginRight;
var buttonAreaStartX = marginLeft;
var buttonAreaStartY = bottomAreaStartY + bottomAreaHeight + marginBetweenBottomAreaAndButtonArea;

var screenHeight = buttonAreaStartY + buttonAreaHeight + marginBottom;

var input = new Array(inputColCount);
for (var col = 0; col < inputColCount; col++) {
	input[col] = new Array(inputRowCount);
	for (var row = 0; row < inputRowCount; row++) {
		input[col][row] = 0;
	}
}

var upNumberColCorrectness = new Array(upNumberColCount);
var leftNumberRowCorrectness = new Array(leftNumberRowCount);
for (var col = 0; col < inputColCount; col++) {
	checkCol(col);
}
for (var row = 0; row < inputRowCount; row++) {
	checkRow(row);
}
checkColAndRowCorrectness();


var lastTouchedInputCellCol = -1;
var lastTouchedInputCellRow = -1;
var lastInput = -1;

//プレイ中（操作可能）かどうか
var isPlaying = false;

var countdownNumber = 3;
var countdownNumberFontSize = Math.floor(mainScreenHeight / 3);
var countdownTimerId = -1;

var timerStartTime = -1;
var timerSecond = 0;
var timerFontSize = inputCellWidth;
var timerTimerId = -1;

var usedItems = {};
usedItems["1"] = 0;
usedItems["2"] = 0;
usedItems["3"] = 0;

//クリア画像の先読み
$('<img src="/img/clear.gif">');

// ===============================================
// ゲーム画面を生成
// ===============================================
window.onload = function(){
	$("#gameScreen")
	.css("width", screenWidth + "px")
	.css("height", screenHeight + "px")
	.css("font-size", Math.floor(inputCellHeight * 0.6) + "px");

	//上の数字セル
	for (var col = 0; col < upNumberColCount; col++) {
		for (var row = 0; row < upNumberRowCount; row++) {
			var id = getUpNumberCellId(col, row);
			var x = upNumberAreaStartX + col * upNumberCellWidth;
			var y = upNumberAreaStartY + row * upNumberCellHeight;
			var color;
			if (col % 2 == 0) {
				color = "#FFFFFF";
			} else {
				color = "#EEEEEE";
			}
			var content;
			if (upNumber[col][row] == 0 && row != upNumberRowCount - 1) {
				content = "";
			} else {
				content = upNumber[col][row];
			}
			$("#gameScreen").append('<div id="' + id + '"></div>');
			$("#" + id)
			.css("position", "absolute")
			.css("left", x + "px")
			.css("top", y + "px")
			.css("background-color", color)
			.css("width", upNumberCellWidth + "px")
			.css("height", upNumberCellHeight + "px")
			.css("line-height", upNumberCellHeight + "px")
			.css("text-align", "center")
			.html(content);
		}
	}
	//左の数字セル
	for (var col = 0; col < leftNumberColCount; col++) {
		for (var row = 0; row < leftNumberRowCount; row++) {
			var id = getLeftNumberCellId(col, row);
			var x = leftNumberAreaStartX + col * leftNumberCellWidth;
			var y = leftNumberAreaStartY + row * leftNumberCellHeight;
			var color;
			if (row % 2 == 0) {
				color = "#FFFFFF";
			} else {
				color = "#EEEEEE";
			}
			var content;
			if (leftNumber[col][row] == 0 && col != leftNumberColCount - 1) {
				content = "";
			} else {
				content = leftNumber[col][row];
			}
			$("#gameScreen").append('<div id="' + id + '"></div>');
			$("#" + id)
			.css("position", "absolute")
			.css("left", x + "px")
			.css("top", y + "px")
			.css("background-color", color)
			.css("width", leftNumberCellWidth + "px")
			.css("height", leftNumberCellHeight + "px")
			.css("line-height", leftNumberCellHeight + "px")
			.css("text-align", "center")
			.html(content);
		}
	}
	
	//入力エリア
	$("#gameScreen").append('<div id="inputArea"></div>');
	$("#inputArea")
	.css("position", "absolute")
	.css("left", inputAreaStartX + "px")
	.css("top", inputAreaStartY + "px")
	.css("width", inputAreaWidth + "px")
	.bind(touchmove, inputArea_touchmove)
	.bind(touchend, inputArea_touchend);

	//入力セル
	for (var col = 0; col < inputColCount; col++) {
		for (var row = 0; row < inputRowCount; row++) {
			var id = getInputCellId(col, row);
			var x = col * inputCellWidth;
			var y = row * inputCellHeight;
			var color;
			if (col % 2 == 0 && row % 2 == 0) {
				color = "#FFFFFF";
			} else {
				color = "#EEEEEE";
			}
			$("#inputArea").append('<div id="' + id + '"></div>');
			$("#" + id)
			.css("position", "absolute")
			.css("left", x + "px")
			.css("top", y + "px")
			.css("background-color", color)
			.css("width", inputCellWidth + "px")
			.css("height", inputCellHeight + "px")
			.css("line-height", inputCellHeight + "px")
			.css("text-align", "center")
			.css("border", "1px solid black")
			.bind(touchstart, {"col": col, "row": row}, inputCell_touchstart);
		}
	}

	//カウントダウンを表示
	$("#gameScreen").append('<div id="countdownWhite"></div>');
	$("#countdownWhite")
	.css("position", "relative")
	.css("z-index", "1")
	.css("height", screenHeight + "px")
	.css("width", screenWidth + "px")
	.css("background-color", "rgba(255, 255, 255, 0.8)");

	$("#countdownWhite").append('<div id="countdown"></div>');
	$("#countdown")
	.css("font-size", countdownNumberFontSize + "px")
	.css("line-height", mainScreenHeight + "px")
	.css("height", mainScreenHeight + "px")
	.css("width", screenWidth + "px")
	.html(countdownNumber);
	countdownTimerId = setInterval("countdown_tick()", 1000);

	//ボトムエリア
	$("#gameScreen").append('<div id="bottomArea"></div>');
	$("#bottomArea")
	.css("position", "absolute")
	.css("top", bottomAreaStartY + "px")
	.css("left", bottomAreaStartX + "px")
	.css("width", bottomAreaWidth + "px")
	.css("height", bottomAreaHeight + "px")
	.css("text-align", "right")
	.css("line-height", bottomAreaHeight + "px");

	//タイマー
	$("#bottomArea").append('<div id="timer"></div>');
	$("#timer")
	.css("float", "right")
	.html(getTimeSpanString(0));

	//ボタンエリア
	$("#gameScreen").append('<div id="buttonArea"></div>');
	$("#buttonArea")
	.css("text-align", "left")
	.css("position", "absolute")
	.css("top", buttonAreaStartY + "px")
	.css("left", buttonAreaStartX + "px")
	.css("width", buttonAreaWidth + "px")
	.css("height", buttonAreaHeight + "px");

	//アイテムボタン
	if (hasItem()) {
		$("#buttonArea").append('<div id="itemArea"></div>');
		$("#itemArea").append('以下のアイテムが使用できます');
		for (var itemId = 1; itemId <= 3; itemId++) {
			if (userItems[itemId]) {
				$("#itemArea").append('<div id="item_' + itemId + '"></div>');
				$("#item_" + itemId).append('<input type="button" id="itemButton_' + itemId + '" name="itemButton_' + itemId + '" value="' + itemName[itemId] + '（×' + userItems[itemId] + '）" />');
				$("#itemButton_" + itemId).bind('click', {"itemId": itemId}, itemButton_click);
			}
		}
		$("#itemArea").append('<br />');
	}

	//ギブアップボタン
	$("#buttonArea").append('<input type="button" id="giveupButton" name="giveupButton" value="ギブアップする" />');
	$("#giveupButton").bind("click", giveupButton_click);

}

// 入力セルがタッチされたとき
function inputCell_touchstart(event) {
	if (isPlaying) {
		if (usesMouseEvents) {
			mouseIsDown = true;
		}
		event.preventDefault();
		var col = event.data.col;
		var row = event.data.row;
		switch (input[col][row]) {
		case 0:
			black(col, row);
			break;
		case 1:
			batsu(col, row);
			break;
		case 2:
			white(col, row);
			break;
		}
	}
}

// タッチ後に動かしたとき
function inputArea_touchmove(event) {
	if (isPlaying && (!usesMouseEvents || mouseIsDown)) {
		//黒と×は、白い場所にのみ連続して入力できる。白は連続して入力できない。
		event.preventDefault();
		var touchPoint = getTouchPoint(event);
		var col = Math.floor((touchPoint.x - inputAreaStartX) / inputCellWidth);
		var row = Math.floor((touchPoint.y - inputAreaStartY) / inputCellHeight);
		if (col >= 0 && col < inputColCount && row >= 0 && row < inputRowCount) {
			if (col != lastTouchedInputCellCol || row != lastTouchedInputCellRow) {
				if (input[col][row] == 0) {
					if (lastInput == 1) {
						black(col, row);
					} else if (lastInput == 2) {
						batsu(col, row);
					}
				}
			}
		}
	}
}

function inputArea_touchend(event) {
	if (usesMouseEvents) {
		mouseIsDown = false;
	}
}

function getTouchPoint(event) {
	if (usesMouseEvents) {
		return new Point(event.originalEvent.pageX, event.originalEvent.pageY);
	} else {
		return new Point(event.originalEvent.touches[0].pageX, event.originalEvent.touches[0].pageY);
	}
}

// セルを黒に
function black(col, row) {
	input[col][row] = 1;
	lastInput = 1;
	var id = getInputCellId(col, row);
	document.getElementById(id).style.backgroundColor = "#000000";
	document.getElementById(id).innerHTML = "";
	lastTouchedInputCellCol = col;
	lastTouchedInputCellRow = row;
	checkColAndRow(col, row);
}

// セルを×に
function batsu(col, row) {
	input[col][row] = 2;
	lastInput = 2;
	var id = getInputCellId(col, row);
	var color;
	if (col % 2 == 0 && row % 2 == 0) {
		color = "#FFFFFF";
	} else {
		color = "#EEEEEE";
	}
	document.getElementById(id).style.backgroundColor = color;

	//Canvasを使って×を描く
	$("#" + id).html('<canvas id="' + id + '_batsu" width="' + inputCellWidth + '" height="' + inputCellHeight + '">×</canvas>');
	var canvas = document.getElementById(id + '_batsu');
	//Canvas要素の対応チェック
	if (canvas && canvas.getContext) {
		var ctx = canvas.getContext('2d');
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(inputCellWidth, inputCellHeight);
		ctx.moveTo(0, inputCellHeight);
		ctx.lineTo(inputCellWidth, 0);
		ctx.closePath();
		ctx.stroke();
	}

	lastTouchedInputCellCol = col;
	lastTouchedInputCellRow = row;
	checkColAndRow(col, row);
}

// セルを白に
function white(col, row) {
	input[col][row] = 0;
	lastInput = 0;
	var id = getInputCellId(col, row);
	var color;
	if (col % 2 == 0 && row % 2 == 0) {
		color = "#FFFFFF";
	} else {
		color = "#EEEEEE";
	}
	document.getElementById(id).style.backgroundColor = color;

	document.getElementById(id).innerHTML = "";

	lastTouchedInputCellCol = col;
	lastTouchedInputCellRow = row;
}

function getInputCellId(col, row) {
	return "inputCell_" + col + "_" + row;
}

function getUpNumberCellId(col, row) {
	return "upNumberCell_" + col + "_" + row;
}

function getLeftNumberCellId(col, row) {
	return "leftNumberCell_" + col + "_" + row;
}

function countdown_tick() {
	if (countdownNumber > 1) {
		countdownNumber--;
		$("#countdown").html(countdownNumber);
	} else {
		clearInterval(countdownTimerId);
		$("#countdown").css("font-size", countdownNumberFontSize / 2 + "px");
		$("#countdown").html("スタート");
		isPlaying = true;
		startTimer();
		$("#countdownWhite").fadeOut(500, countdownWhite_end);
	}
}

function countdownWhite_end() {
	$("#countdownWhite").remove();
}

function startTimer() {
	timerStartTime = new Date().getTime();
	//0.1秒に一回チェック
	timerTimerId = setInterval("timer_tick()", 100);
}

function stopTimer() {
	clearInterval(timerTimerId);
}

function timer_tick() {
	timerSecond = Math.floor((new Date().getTime() - timerStartTime) / 1000);
	$("#timer").html(getTimeSpanString(timerSecond));
}

//列の正しさチェック
function checkCol(col) {
	var inputColChunk = new Array(upNumberRowCount);
	for (var inputColChunkNumber = 0; inputColChunkNumber < upNumberRowCount; inputColChunkNumber++) {
		inputColChunk[inputColChunkNumber] = 0;
	}
	for (var row = 0, inputColChunkNumber = 0; row < inputRowCount; row++) {
		if (input[col][row] == 1) {
			inputColChunk[inputColChunkNumber]++;
		} else if (inputColChunk[inputColChunkNumber] > 0) {
			inputColChunkNumber++;
		}
	}
	upNumberColCorrectness[col] = false;
	var upNumberRow = 0;
	var inputColChunkNumber = 0
	while (upNumberRow < upNumberRowCount - 1 && upNumber[col][upNumberRow] == 0) {
		upNumberRow++;
	}
	while (upNumber[col][upNumberRow] == inputColChunk[inputColChunkNumber]) {
		if (upNumberRow == upNumberRowCount - 1) {
			if (inputColChunkNumber == upNumberRowCount - 1 || inputColChunk[inputColChunkNumber + 1] == 0) {
				upNumberColCorrectness[col] = true;
				checkColAndRowCorrectness();
			}
			break;
		} else {
			upNumberRow++;
			inputColChunkNumber++;
		}
	}
}

//行の正しさチェック
function checkRow(row) {
	var inputRowChunk = new Array(leftNumberColCount);
	for (var inputRowChunkNumber = 0; inputRowChunkNumber < leftNumberColCount; inputRowChunkNumber++) {
		inputRowChunk[inputRowChunkNumber] = 0;
	}
	for (var col = 0, inputRowChunkNumber = 0; col < inputRowCount; col++) {
		if (input[col][row] == 1) {
			inputRowChunk[inputRowChunkNumber]++;
		} else if (inputRowChunk[inputRowChunkNumber] > 0) {
			inputRowChunkNumber++;
		}
	}
	leftNumberRowCorrectness[row] = false;
	var leftNumberCol = 0;
	var inputRowChunkNumber = 0
	while (leftNumberCol < leftNumberColCount - 1 && leftNumber[leftNumberCol][row] == 0) {
		leftNumberCol++;
	}
	while (leftNumber[leftNumberCol][row] == inputRowChunk[inputRowChunkNumber]) {
		if (leftNumberCol == leftNumberColCount - 1) {
			if (inputRowChunkNumber == leftNumberColCount - 1 || inputRowChunk[inputRowChunkNumber + 1] == 0) {
				leftNumberRowCorrectness[row] = true;
				checkColAndRowCorrectness();
			}
			break;
		} else {
			leftNumberCol++;
			inputRowChunkNumber++;
		}
	}
}

//行と列の正しさチェック
function checkColAndRow(col, row) {
	checkCol(col);
	checkRow(row);
}

//すべての列と行について正しいとされているかチェック
function checkColAndRowCorrectness() {
	for (var col = 0; col < inputColCount; col++) {
		if (!upNumberColCorrectness[col]) {
			return;
		}
	}
	for (var row = 0; row < inputRowCount; row++) {
		if (!leftNumberRowCorrectness[row]) {
			return;
		}
	}
	clear();
}

//秒を00分00秒に変換（99分99秒まで）
function getTimeSpanString(s) {
	var result = "";
	if (s >= 5999) {
		result = "99分99秒";
	} else {
		var minute = Math.floor(s / 60);
		var second = s % 60;
		if (minute > 0) {
			result += minute + "分";
			if (second < 10) {
				result += "0";
			}
		}
		result += second + "秒";
	}
	return result;
}

//クリア画面を表示
function clear() {
	//操作不可
	isPlaying = false;
	//タイマーを止める
	stopTimer();

	//クリア画像を表示
	var paddingTop = Math.floor(mainScreenHeight * 0.05);
	var clearImageWidth = Math.floor(screenWidth * 0.8);
	var clearImageHeight = clearImageWidth;

	$("#gameScreen").append('<div id="clearWhite"></div>');
	$("#clearWhite")
	.css("position", "relative")
	.css("z-index", "1")
	.css("height", screenHeight + "px")
	.css("width", screenWidth + "px")
	.css("background-color", "rgba(255, 255, 255, 0.8)");

	$("#clearWhite").append('<div id="clear"></div>');
	$("#clear")
	.css("padding-top", paddingTop + "px")
	.css("text-align", "center")
	.css("height", mainScreenHeight + "px")
	.css("width", screenWidth + "px")
	.append('<img src="/img/clear.gif" alt="CLEAR CONGRATULATIONS" width=' + clearImageWidth + ' height=' + clearImageHeight + ' />')
	.append('<br />')
	.append(getTimeSpanString(timerSecond) + "でクリア")
	.append('<br />')
	.append('<input type="button" id="clearButton" name="clearButton" value="結果をみる" />');

	$("#clearButton").bind("click", clearButton_click);
}

//アイテムボタンのクリックイベント
function itemButton_click(event) {
	var itemId = event.data.itemId;
	// jConfirm(itemName[itemId] + "を使用してもよろしいですか？", "確認", function (r) {
		// if (r == true) {
			// //「はい」をクリック
			// userItems[itemId]--;
			// usedItems[itemId]++;
			// updateItemButton(itemId);
			// //スグクリアの場合はクリア
			// if (itemId == 1 || itemId == "1") {
				// clear();
			// }
		// }
	// });
}

//アイテムボタンの表示を更新する
function updateItemButton(itemId) {
	if (userItems[itemId] > 0) {
		//個数を減らす
		$("#item_" + itemId).html('<input type="button" id="itemButton_' + itemId + '" name="itemButton_' + itemId + '" value="' + itemName[itemId] + '（×' + userItems[itemId] + '）" />');
		$("#itemButton_" + itemId).bind('click', {"itemId": itemId}, itemButton_click);
	} else {
		//ボタンそのものを削除
		if (hasItem()) {
			$("#item_" + itemId).remove();
		} else {
			$("#itemArea").remove();
		}
	}

}

//アイテムを持っているかどうか調べる
function hasItem() {
	var result = false;
	for (var itemId = 1; itemId <= 3; itemId++) {
		if (userItems[itemId] > 0) {
			result = true;
		}
	}
	return result;
}

//ギブアップボタンのクリックイベント
function giveupButton_click(event) {
	// jConfirm("ギブアップしてもよろしいですか？", "確認", function (r) {
		// if (r == true) {
			// location.href = giveupUri;
		// }
	// });
}

//クリアボタンのクリックイベント
function clearButton_click(event) {
	//ダブルクリック防止のために一度クリックしたらdisabledにする
	$("#clearButton").attr('disabled','disabled');
	//答えを文字列に変換
	var answer = "";
	var binary = "";
	for (var row = 0; row < inputRowCount; row++) {
		for (var col = 0; col < inputColCount; col++) {
			if (input[col][row] == 1) {
				binary += "1";
			} else {
				binary += "0";
			}
			if (binary.length == 8) {
				var hex = parseInt(binary, 2).toString(16);
				if (hex.length == 1) {
					hex = "0" + hex.toString();
				}
				answer += hex;
				binary = "";
			} else if (row == inputRowCount - 1 && col == inputColCount - 1) {
				//右端を0で埋める
				binary += new Array(8 - binary.length + 1).join('0');
				var hex = parseInt(binary, 2).toString(16);
				if (hex.length == 1) {
					hex = "0" + hex.toString();
				}
				answer += hex;
			}
		}
	}
	if (timerSecond > 5999) {
		timerSecond = 5999;
	}
	$("#gameScreen").append('<form id="clearForm" method="post" action="' + clearUri +'"></form>');
	$("#clearForm").append(getHiddenInputTagString("segmentTimeStamp", segmentTimeStamp));
	$("#clearForm").append(getHiddenInputTagString("clearTime", timerSecond));
	$("#clearForm").append(getHiddenInputTagString("answer", answer));
	//デバッグ用
	//$("#clearForm").append(getHiddenInputTagString("opensocial_owner_id", opensocial_owner_id));

	//アイテムの使用情報
	for (var itemId = 1; itemId <= 3; itemId++) {
		if (usedItems[itemId] > 0) {
			$("#clearForm").append(getHiddenInputTagString("itemId" + itemId + "usedCount", usedItems[itemId]));
		}
	}
	$("#clearForm").submit();
}

function getHiddenInputTagString(name, value) {
	return '<input type="hidden" name="' + name +'" value="' + value + '" />';
}