var body = document.getElementsByTagName("body")[0];
var audioUrl = require('@/assets/alarm.wav');
import requestApi from '@/request/index'

export const areaMixin={
    inject: ["playVideoFile",'showVideo', 'playLive',"hideVideo"],
    data(){
        return{
            timer:null,
            beltBox:[],
            warnObject:'',
            isAutoCancel:false,
            videoUrl:'http://47.93.23.221:9982/hls/test.m3u8',
        }
    },
    created(){
        this.getArea();
        this.timer=setInterval(()=>{
            this.getArea();
        },3000)
    },
    mounted() {
        // setTimeout(()=>{
        //     // let url = "./assets/live";
        //     // this.playVideoFile(url);
        //     let data = [
        //         {
        //             id:1,
        //         },
        //         {
        //             id:2
        //         },
        //         {
        //             id:3,
        //         }
        //     ]
        //     this.showVideo(data)
        // },5000)
    },
    methods:{
        getArea(){
            requestApi.getArea().then(res=>{
                if(res.code==1000){
                    this.beltBox = res.data;
                    // this.beltBox = this.beltBox.sort((a,b)=>a.b_no-b.b_no);
                    this.beltBox = this.sortMixData(this.beltBox);
                    if(!this.activeName){
                        this.activeName = res.data.length?res.data[0].b_no+'':''
                    }
                    let warnBox = res.data.filter(item=>item.b_state==3 || item.b_state==0 || item.b_state==2);
                    let warnStr = '';
                    if(this.warnObject==JSON.stringify(warnBox)){
                        this.isAutoCancel = false;
                        return false
                    }else{
                        this.isAutoCancel = true;
                        this.$notify.closeAll();
                        this.warnObject = JSON.stringify(warnBox);
                        warnBox.map((item,index)=>{
                            let warnString= '告警';
                            if(item.b_state==0 || item.b_state==2){
                                warnString="离线"
                            }
                            if(index==warnBox.length-1){
                                warnStr+=item.b_no+`号皮带${warnString}`
                            }else{
                                warnStr+=item.b_no+`号皮带${warnString}、`
                            }
                        });
                        if(warnStr){
                            if (body.getElementsByTagName("audio").length <= 0) {
                                var audio = document.createElement("audio");
                                audio.setAttribute("id", "awardAudio");
                                audio.setAttribute("autoplay", true);
                                audio.setAttribute("loop", true);
                                audio.setAttribute("hidden", true);
                                audio.setAttribute("src", audioUrl);
                                body.appendChild(audio);
                            }
                            this.$notify.error({
                                title: '提示',
                                message: warnStr+'，请注意查看',
                                icon:'warn',
                                position: 'bottom-right',
                                duration: 0,
                                onClose:result=>{
                                    this.warnObject = '';
                                    // if(!this.isAutoCancel){//手动
                                    //     console.log('手动取消的')
                                    // }
                                },
                                onClick:res=>{
                                    this.$notify.closeAll();
                                    this.$router.push({path:'/belt?b_no='+warnBox[0].b_no})
                                    console.log(res)
                                }
                            });
                        }else{
                            if (body.getElementsByTagName("audio").length > 0) {
                                var audio = body.getElementsByTagName("audio")[0]
                                body.removeChild(audio);
                            }
                        }
                    }
                }
            })
        },
        sortMixData(data){
            let numberBox = [];
            let lowerBox = [];
            let upperBox = [];

            data.map(item=>{
                let first = item.b_no[0].charCodeAt();
                //对首字符进行判断
                if(first >= 97 && first<= 122){
                    //首字符为小写字母
                    lowerBox.push(item)
                }else if(first >= 65 && first<= 90){
                    //首字符为大写字母
                    upperBox.push(item)
                }else{
                    //首字符为数字
                    numberBox.push(item)
                }
            });

            numberBox = this.reverserBox(numberBox);
            lowerBox = this.reverserBox(lowerBox);
            upperBox = this.reverserBox(upperBox);
            return [...numberBox,...lowerBox,...upperBox]
        },
        reverserBox(data){
            data.sort(function (a, b) { return b.b_no.charCodeAt() - a.b_no.charCodeAt() }).reverse();
            return data
        }
    },
    beforeDestroy(){
        console.log('destory')
        if (body.getElementsByTagName("audio").length > 0) {
            var audio = body.getElementsByTagName("audio")[0]
            body.removeChild(audio);
        }
        this.$notify.closeAll();
        clearInterval(this.timer);
    }
}