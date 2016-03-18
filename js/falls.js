$(function(){
  //nums 初始化个数 dwidth div宽度 mar div左右间隔 mar_t 上下间隔 append_len 每次滑动添加div个数
  var Falls = function(nums,dwidth,mar,mar_t,append_len){
    var self =this;
    this.nums = nums;
    this.divs_height = new Array();//每个div高度值
    this.col = 0;//列数
    this.cols_h = new Array();//每列高度
    this.dwidth = dwidth;
    this.mar = mar;
    this.mar_t = mar_t;
    this.append_len = append_len;
    (function(){
      self.contain_width();
      var divs ='';
      var length = self.nums;
      for (var i = 0; i < length; i++) {
        divs += '<div></div>';
      };
      $('#contain').html(divs);
      self.divs_style(self.nums);
      self.divs_position(self.col);
    })();
  };
  //a-b 随机高度
  Falls.random_height = function(a,b){
    return Math.round(100 + Math.random()*(b-a));
  };
  //返回高度最小的列 arr 列高度数组 minH 最小高度
  Falls.get_min_hindex = function(arr,minH){
    for(var i in arr){
      if(arr[i]==minH)return i;
    }
  };
  Falls.prototype = {
    //divs 高度
    divs_style: function(a){
      for(var i = this.divs_height.length; i < a; i++){
        this.divs_height[i] = Falls.random_height(100,300);
      }
    },
    //contain 宽度
    contain_width : function(){
      this.col = Math.floor(($('body')[0].clientWidth + this.mar)/(this.dwidth + this.mar)); //赋值col
      $('#contain').css('width',this.col*(this.dwidth + this.mar) - this.mar);
    },
    //初始化div位置
    divs_position : function(){
      this.cols_h.length = 0;
      var length = this.nums;
      for(var i = 0; i < length; i++){
        if(i < this.col){
          this.cols_h[i] = this.divs_height[i];
          $('#contain div:nth-child('+ (i+1) +')').css('left',i*(this.dwidth + this.mar)).css('top',0).css('height',this.divs_height[i]).css('width',this.dwidth);
        }else{
          this.set_div_p(i+1);
        }
      }
    },
    append_div : function(){
      var l = $('#contain div').length;
      this.divs_style(this.nums+this.append_len+1);
      var length = this.nums+this.append_len;
      for (var i = l; i < length ; i++) {
        $('#contain').append('<div></div>');
        this.set_div_p(i+1);
      }
      this.nums += this.append_len;
    },
    //单个div位置 a div序数
    set_div_p : function(a){
      var minH = Math.min.apply(null,this.cols_h);
      var minHIndex = Falls.get_min_hindex(this.cols_h,minH);
      $('#contain div:nth-child('+ a +')').css('left',minHIndex*(this.dwidth + this.mar)).css('top',minH+this.mar_t).css('height',this.divs_height[a-1]).css('width',this.dwidth);
      this.cols_h[minHIndex] = this.cols_h[minHIndex] + this.mar_t + this.divs_height[a-1];
    },
    //滚动添加
    scroll_append : function(){
      if(window.pageYOffset + window.innerHeight >= (Math.max.apply(null,this.cols_h)+20)){
        this.append_div();
      }
    },
    resize : function(){
      this.contain_width();
      this.divs_position(this.col);
    }
  };
  var falls = new Falls(40,200,10,10,10);
  $(window).bind('resize',function(){falls.resize();}).bind('scroll',function(){falls.scroll_append();});
})
