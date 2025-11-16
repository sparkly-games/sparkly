var MS_ROLLING_SCORE = 750;
function CRollingScore() {

    var _oTweenText = null;
    var _oTweenTextStroke = null;

    this.rolling = function (oScoreText, oScoreTextStruct, iScore) {
        
        if(iScore > parseInt(oScoreText.text)){
            oScoreText.color = "#3dd700"
        }else if(iScore < parseInt(oScoreText.text)){
            oScoreText.color = "#d50000"
        }
        
        _oTweenText = createjs.Tween.get(oScoreText).to({text: iScore}, MS_ROLLING_SCORE, createjs.Ease.cubicOut).call(function () {
            createjs.Tween.removeTweens(_oTweenText);
            oScoreText.color = "#fff";
        }).addEventListener("change", function () {
            oScoreText.text = Math.floor(oScoreText.text);
        })

        if (oScoreTextStruct !== null) {
            _oTweenTextStroke = createjs.Tween.get(oScoreTextStruct).to({text: iScore}, MS_ROLLING_SCORE, createjs.Ease.cubicOut).call(function () {
                createjs.Tween.removeTweens(_oTweenTextStroke);
            }).addEventListener("change", function () {
                oScoreTextStruct.text = Math.floor(oScoreTextStruct.text);
            })

        }
    };

    return this;
}

