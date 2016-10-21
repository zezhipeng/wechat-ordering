'use strict'


var ejs = require('ejs')
var heredoc = require('heredoc')

// 我们先把这个 XML 的结构给拼接起来，在这个 XML 结构里面呢，首先是几个定死的字段，比如 ToUserName FromUserName CreateTime，然后就是消息类型，这个就复杂一些了，我们已经知道有纯文本的，图片的，语音视频，甚至图文的，那我们就一个一个的弄进来.

// 全部拼接完这个 XML 结构后，我们其实是需要整个这段的字符串来交给 EJS 进行编译的，所以这里我们用 heredoc 来拿到整段字符串，用法很简单，就是把这一段给注释起来，然后调用  heredoc 方法，传入一个回调函数，在回调函数体里面是这段注释代码，然后执行这个 heredoc 就拿到字符串了，是不是很简单。
var tpl = heredoc(function() {/*
  <xml>
    <ToUserName><![CDATA[<%= toUsername %>]]></ToUserName>
    <FromUserName><![CDATA[<%= fromUsername %>]]></FromUserName>
    <CreateTime><%= createTime %></CreateTime>
    <MsgType><![CDATA[<%= msgType %>]]></MsgType>
  <% if (msgType === "text") { %>
    <Content><![CDATA[<%- content %>]]></Content>
  <% } else if (msgType === "image") { %>
    <Image>
      <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
    </Image>
  <% } else if (msgType === "voice") { %>
    <Voice>
      <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
    </Voice>
  <% } else if (msgType === "video") { %>
    <Video>
      <MediaId><![CDATA[<%= content.mediaId %>]]></MediaId>
      <Title><![CDATA[<%= content.title %>]]></Title>
      <Description><![CDATA[<%= content.description %>]]></Description>
    </Video>
  <% } else if (msgType === "music") { %>
    <Music>
      <Title><![CDATA[<%= content.title %>]]></Title>
      <Description><![CDATA[<%= content.description %>]]></Description>
      <MusicUrl><![CDATA[<%= content.musicUrl %>]]></MusicUrl>
      <HQMusicUrl><![CDATA[<%= content.hqMusicUrl %>]]></HQMusicUrl>
      <ThumbMediaId><![CDATA[<%= content.thumbMediaId %>]]></ThumbMediaId>
    </Music>
  <% } else if (msgType === "news") { %>
    <ArticleCount><%= content.length %></ArticleCount>
    <Articles>
    <% content.forEach(function(item) { %>
      <item>
        <Title><![CDATA[<%= item.title %>]]></Title>
        <Description><![CDATA[<%= item.description %>]]></Description>
        <PicUrl><![CDATA[<%= item.picUrl %>]]></PicUrl>
        <Url><![CDATA[<%= item.url %>]]></Url>
      </item>
    <% }); %>
    </Articles>
  <% } %>
  </xml>
*/})

// 接下来，来编译这个 ejs 模板，再把 编译后的模板函数暴漏出去。
var compiled = ejs.compile(tpl)

exports = module.exports = {
  compiled: compiled
}
