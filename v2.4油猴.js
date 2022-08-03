// ==UserScript==
// @name         B站 腾讯视频 调色
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       xiao_贤
// @match        *://www.bilibili.com/video/*
// @match        *://v.qq.com/x/cover/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// ==/UserScript==

(function() {

    var dd=0;
    var spdd=setInterval(function (){

        //更新说明
        //调色范围：饱和度+-10，对比度+-10 ，删除了亮度+-10。
        //添加 语句 -4.2
        //修改 -3
        //添加 -3.1 判断视频网页 B站 腾讯视频
        //修改 0
        //修改 1
        //添加 1.1 时间ui 判断
        //添加 1.2 1.3 1.4
        //添加 5 调色的运行与暂停，捆绑了视频的播放与暂停


        //实现祖国统一的决心坚如磐石。=>对应首字母=>1,1,1,0,1,1,1,1,1,1,0,0,1,/
        var x="1,1,1,0,1,1,1,1,1,1,0,0,1,/";
        //-3 ui html样式
        var Ts_x = 0;
        var BiLiBiLiSP_div = document.getElementsByClassName("bilibili-player-video");
        var TXSP_div = document.getElementsByClassName("txp_videos_container");
        //-3.1 判断视频网页 B站 腾讯视频
        if(BiLiBiLiSP_div.length != 0){Ts_x=BiLiBiLiSP_div;}
        else if(TXSP_div.length != 0){Ts_x=TXSP_div;}
        //-2 定义数组下标
        var n=0;
        //-1 X:01数组 length:12
        var X=x.split(",");
        //0 网页ui 需要播放
        var timeff_t_zong = 0;
        var bilibili_t_zong = document.getElementsByClassName("bilibili-player-video-time-total");
        var txsp_t_zong = document.getElementsByClassName("txp_time_duration");
        //1 网页ui 已经播放
        var timeff_now_ui = 0;
        var bilibili_now_ui = document.getElementsByClassName("bilibili-player-video-time-now");
        var txsp_now_ui = document.getElementsByClassName("txp_time_current");
        //1.1 时间ui 判断
        if(bilibili_t_zong.length != 0){timeff_t_zong = bilibili_t_zong;timeff_now_ui = bilibili_now_ui;}
        else if(txsp_t_zong.length != 0){timeff_t_zong = txsp_t_zong;timeff_now_ui = txsp_now_ui;}
        //1.2 时间ui 腾讯视频网页中，已经播放时间，自动变00:00问题，每一秒检测txsp_play.length,txsp_pause.length,txsp_replay.length。因为html显示提示，播放与暂停位置互换了。
        var txsp_pause = document.getElementsByClassName("txp_btn txp_btn_play play_btn_play");
        var txsp_play = document.getElementsByClassName("txp_btn txp_btn_play play_btn_pause");
        var txsp_replay = document.getElementsByClassName("txp_btn txp_btn_play play_btn_replay");
        //1.3 顺便添加B站，播放与暂停的ui。暂停bilibili_pause.length=1；播放bilibili_pause.length=0；
        //bilibili-player-video-btn bilibili-player-video-btn-start video-state-pause
        var bilibili_pause = document.getElementsByClassName("bilibili-player-video-btn bilibili-player-video-btn-start video-state-pause");
        var bilibili_play = document.getElementsByClassName("bilibili-player-video-btn bilibili-player-video-btn-start");

        //2数据处理
        function timeff(timeff_now_ui){
            var timeff_T=timeff_now_ui[0].innerHTML;
            for(var timeff_i=0;timeff_i<=timeff_T.length;timeff_i++)
            {
                var timeff_hh;
                var timeff_mm;
                var timeff_ss;
                if(timeff_T[timeff_i]==':')
                {
                    if(timeff_T.length>6)
                    {
                        timeff_hh=Number(timeff_T[timeff_i-1])+Number(timeff_T[timeff_i-2])*10;
                        timeff_mm=Number(timeff_T[timeff_i+2])+Number(timeff_T[timeff_i+1])*10;
                        timeff_ss=Number(timeff_T[timeff_i+4])*10+Number(timeff_T[timeff_i+5]);
                    }
                    if(timeff_T.length<6)
                    {
                        timeff_hh=0;
                        timeff_mm=Number(timeff_T[timeff_i-1])+Number(timeff_T[timeff_i-2])*10;
                        timeff_ss=Number(timeff_T[timeff_i+1])*10+Number(timeff_T[timeff_i+2]);
                    }
                }
            }
            //alert('timeff_hh:'+timeff_hh+'timeff_mm:'+timeff_mm+'timeff_ss:'+timeff_ss);
            //alert(timeff_hh*60+timeff_mm*60+timeff_ss+'秒');
            var timeff_ts=timeff_hh*60+timeff_mm*60+timeff_ss;
            return timeff_ts;
            //返回数字
        }
        //需要播放sj
        var time_z = timeff(timeff_t_zong);
        //3得到时间数字
        var time_now_1c= timeff(timeff_now_ui);
        //4每1s得到时间数字
        var TIME_NOW=setInterval(function (){if(time_now_1c==time_z||txsp_replay.length==1)clearInterval(TIME_NOW);//退出
                                             //每加一秒，当前播放时间
                                             time_now_1c= timeff(timeff_now_ui);
                                             //每加一秒，输出当前播放时间
                                             console.log(time_now_1c);
                                             //每加一秒，就X[n]的下标n+1，当下标大于X的长度，下标n=0
                                             n++;if(n>=X.length)n=0;
                                             // 1.4
                                             //腾讯视频播放 txsp_play.length=1;	腾讯视频暂停 txsp_play.length==0
                                             //bilibili播放 !bilibili_pause.length=0;	bilibili暂停 !bilibili_pause.length=1;
                                             //因为相反所以-1
                                             var splay=1;
                                             if(BiLiBiLiSP_div.length != 0){splay=!bilibili_pause.length;}
                                             else if(TXSP_div.length != 0){splay=txsp_play.length;}
                                             //每加一秒，输出X[n],n,
                                             console.log('splay='+splay+'n='+n+'/X[n]='+X[n]);
                                             // 5 调色运行与暂停
                                             if(splay!=0){
                                                 //每加一秒，X[n]=='1',就S_NOW_TS
                                                 if(X[n]=='1')
                                                 {S_NOW_TS();}
                                                 //每加一秒，X[n]=='0',就W_NOW_TS
                                                 else if(X[n]=='0')
                                                 {W_NOW_TS();}
                                                 //每加一秒，X[n]=='/'&&X[n-1]=='1',就S_NOW_TS
                                                 else if((X[n]=='/')&&(X[n-1]=='1'))
                                                 {S_NOW_TS();}
                                                 //每加一秒，X[n]=='/'&&X[n-1]=='0',就W_NOW_TS
                                                 else if((X[n]=='/')&&(X[n-1]=='0'))
                                                 {W_NOW_TS();}
                                             }

                                             //注意：这里不能定义变量 var tt= timeff(timeff_now_ui);
                                            },1000);

        //+20 1000ms
        function W_NOW_TS(){
            //每50ms，w +1
            var w=20;
            //每50ms，t +1
            var t=0;
            var TS_NOW_w=setInterval(function (){if(w==0)clearInterval(TS_NOW_w);//退出
                                                 //console.log(w);
                                                 //+t
                                                 //if(t<10)Ts_x[0].style.filter='saturate('+(100+t)+'%) brightness('+(100+t)+'%) contrast('+(100+t)+'%)';
                                                 if(t<10)Ts_x[0].style.filter='saturate('+(100+t)+'%) contrast('+(100+t)+'%)';
                                                 //-t
                                                 if(t>=10)Ts_x[0].style.filter='saturate('+(120-t)+'%) contrast('+(120-t)+'%)';
                                                 w--;t++;
                                                },50);
        }

        //-20 1000ms
        function S_NOW_TS(){
            //每50ms,s -1
            var s=20;
            //每50ms，t -1
            var t=0;
            var TS_NOW_s=setInterval(function (){if(s==0)clearInterval(TS_NOW_s);//退出
                                                 //console.log(s);
                                                 //-t
                                                 if(t<10)Ts_x[0].style.filter='saturate('+(100-t)+'%) contrast('+(100-t)+'%)';
                                                 //+t
                                                 if(t>=10)Ts_x[0].style.filter='saturate('+(80+t)+'%) contrast('+(80+t)+'%)';
                                                 s--;t++;
                                                },50);
        }

        //100 +10 -10
        //100 -10 +10

        //退出
        dd=1;
        if(dd==1)clearInterval(spdd);
    },10000);
    
})();