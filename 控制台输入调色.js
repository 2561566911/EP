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


//目前只能控制台输入 视频暂停一次就退出js
//运行js时与视频开始播放间隔要小于1秒，因为js中 spdd 定时器每隔一秒判断的视频是否暂停，是就退出js


(function() {

    var dd=0;
    var spdd=setInterval(function (){//使用1个定时器 

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
        //加入的修改排号(-3,-2,-1...) 内容 
		//-3 ui html样式
			var Ts_x = 0;
			//(过时)var BiLiBiLiSP_div = document.getElementsByClassName("bilibili-player-video");
			//b站更新
			//bpx-player-video-wrap
			var BiLiBiLiSP_div = document.getElementsByClassName("bpx-player-video-wrap");
			//document.getElementById()返回对拥有指定 id 的
			//document.getElementsByClassName() 返回文档中所有指定类名的
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
			//（过时）var bilibili_t_zong = document.getElementsByClassName("bilibili-player-video-time-total");
			//备注：document.getElementsByClassName("bpx-player-ctrl-time-label")[0].innerText
			//		"00:35 / 01:01"
			//		重点是数组[0]才显示	
			var bilibili_t_zong =document.getElementsByClassName("bpx-player-ctrl-time-duration");
			var txsp_t_zong = document.getElementsByClassName("txp_time_duration");
        //1 网页ui 已经播放
			var timeff_now_ui = 0;
			var bilibili_now_ui = document.getElementsByClassName("bpx-player-ctrl-time-current");
			var txsp_now_ui = document.getElementsByClassName("txp_time_current");
        //1.1 时间ui 判断
			if(bilibili_t_zong.length != 0){timeff_t_zong = bilibili_t_zong;timeff_now_ui = bilibili_now_ui;}
			else if(txsp_t_zong.length != 0){timeff_t_zong = txsp_t_zong;timeff_now_ui = txsp_now_ui;}
        //1.2 时间ui 腾讯视频网页中，已经播放时间，自动变00:00问题，每一秒检测txsp_play.length,txsp_pause.length,txsp_replay.length。因为html显示提示，播放与暂停位置互换了。
			var txsp_pause = document.getElementsByClassName("txp_btn txp_btn_play play_btn_play");
			var txsp_play = document.getElementsByClassName("txp_btn txp_btn_play play_btn_pause");
			var txsp_replay = document.getElementsByClassName("txp_btn txp_btn_play play_btn_replay");
        //1.3 顺便添加B站，播放与暂停的ui。
			//（过时）bilibili-player-video-btn bilibili-player-video-btn-start video-state-pause
			var bilibili_pause = document.getElementsByClassName("bpx-player-row-dm-wrap bili-paused");
			//暂停1；播放0  bilibili_pause.length=0；
			//（多余）var bilibili_play = document.getElementsByClassName("bilibili-player-video-btn bilibili-player-video-btn-start");

        //2数据处理
        function timeff(timeff_now_ui)
		{
			//if(bilibili_pause.length==0)
			//{
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
			//}
        }
        //需要播放时间
        var time_z = timeff(timeff_t_zong);
        //3得到时间数字
        var time_now_1c= timeff(timeff_now_ui);
        //4每1s得到时间数字
        var TIME_NOW=setInterval(function ()			//使用三个定时器 1
		{
			if(txsp_replay.length==0||bilibili_pause.length==1){clearInterval(TIME_NOW);}//time_now_1c==time_z播放完||腾讯视频暂停0||b站视频暂停1  //退出
			 //每加一秒，当前播放时间
				time_now_1c= timeff(timeff_now_ui);
			 //每加一秒，输出当前播放时间
				console.log(time_now_1c);
				//如果
			 //每加一秒，就X[n]的下标n+1，当下标大于X的长度，下标n=0
				n++;if(n>=X.length){n=0;}
			 // 1.4
			 //腾讯视频播放1	腾讯视频暂停0 txsp_play.length==0
			 //bilibili播放0 	bilibili暂停1 bilibili_pause.length=1;
			 //因为相反所以-1
				var splay=1;
				if(BiLiBiLiSP_div.length != 0){splay=!bilibili_pause.length;}//如果不在b站视频界面，调色暂停，splay=0
				else if(TXSP_div.length != 0){splay=txsp_play.length;}
			 //每加一秒，输出X[n],n,
				console.log('splay='+splay+'n='+n+'/X[n]='+X[n]);
			 //退出时，运行最后一次打印
				if(bilibili_pause.length==1){console.clear();console.log('//退出//');}
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
		
		//间隔1秒来自动调色<div class="bpx-player-video-wrap" style="filter: saturate(100%) brightness(100%) contrast(58%);">
			//+20 1000ms
			function W_NOW_TS(){
				//每50ms，w +1
					var w=20;
				//每50ms，t +1
					var t=0;
				var TS_NOW_w=setInterval(function ()//使用三个定时器 2
				{
					if(w==0){clearInterval(TS_NOW_w);}//执行20次退出
					 //console.log(w);
					 //+t
						//if(t<10)Ts_x[0].style.filter='saturate('+(100+t)+'%) brightness('+(100+t)+'%) contrast('+(100+t)+'%)';
						if(t<10){Ts_x[0].style.filter='saturate('+(100+t)+'%) contrast('+(100+t)+'%)';}
					 //-t
						if(t>=10){Ts_x[0].style.filter='saturate('+(120-t)+'%) contrast('+(120-t)+'%)';}
					 w--;
					 t++;
				},50);
			}
				//-20 1000ms
			function S_NOW_TS()
			{
				//每50ms,s -1
					var s=20;
				//每50ms，t -1
					var t=0;
				var TS_NOW_s=setInterval(function ()//使用三个定时器 3
				{
					if(s==0){clearInterval(TS_NOW_s);}//执行20次退出
					//console.log(s);
					//-t
						if(t<10){Ts_x[0].style.filter='saturate('+(100-t)+'%) contrast('+(100-t)+'%)';}
					//+t
						if(t>=10){Ts_x[0].style.filter='saturate('+(80+t)+'%) contrast('+(80+t)+'%)';}
					s--;
					t++;
				},50);
			}
			//100 +10 -10
			//100 -10 +10

        
        if(bilibili_pause.length==1){dd=1;console.log('//退出//')}
        if(dd==1){clearInterval(spdd);}//暂停退出
    },1000);
    //if(bilibili_pause.length==0){spdd}；
})();
