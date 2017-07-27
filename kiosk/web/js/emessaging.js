function initMessaging(){$(".app-wrapper .blackout-wrapper").hide(),$(".reply-actions-panel").hide(),mockData_API(),category=$(".app-wrapper .navigation-button:first"),changeCategory()}function changeCategory(){var e=category.data("thetitle"),a=function(){callCategory_API(e),closeReply(),"sent"==e.toLowerCase()?$(".message-info .line-1 span:first").text("To:"):$(".message-info .line-1 span:first").text("From:"),$(".app-wrapper .header span").text(e),$(".navigation-button").removeClass("navigation-button-selected"),category.addClass("navigation-button-selected"),$(".column-2a").empty(),$.each(messageList,function(e,a){appendMessage(e,a)}),openFirst()},t={alertType:"danger",content:"Warning: Your reply message will be discarded!",primaryActionText:"discard",secondaryActionText:"cancel",primaryAction:a,secondaryAction:function(){category=previousCategory}};replying?callModal(t):a()}function sortMessages(){}function appendMessage(e,a){var t=""!=a.attachment?"icons8-attach":"",n=1==a.unread?"unread-message":"";$(".column-2a").append('<div class="message-wrapper '+n+'" data-theKey="'+e+'""><div class="message-content-wrapper"><ul><li><span class="person">'+a.person+'</span><i class="attachment '+t+'"></i><span class="time">'+a.time+'</span></li><li><span class="subject">'+(a.subject+" - "+a.body).substr(0,30)+"...</span></li></ul></div></div>")}function openMessage(){var e=selectedMessage.data("thekey");if(console.log(messageList[e]),$(".email-message").show(),$(".message-wrapper").removeClass("message-wrapper-selected"),selectedMessage.removeClass("unread-message"),messageList[e].unread=0,selectedMessage.addClass("message-wrapper-selected"),$(".message-info .line-1 span:last").text(messageList[e].person),$(".message-info .line-2 span:last").text(messageList[e].subject),""!=messageList[e].attachment?($(".message-info .line-3 span:last").text(messageList[e].attachment),$(".message-info .line-3").show()):$(".message-info .line-3").hide(),messageList[e].returnPostage?$(".action-1").show():$(".action-1").hide(),"trash"==category.data("thetitle").toLowerCase()?($(".action-1").hide(),$(".action-2").show()):$(".action-2").hide(),$(".message-body span").html(messageList[e].body),Object.keys(messageList[e].threadedMessages).length)for(i=Object.keys(messageList[e].threadedMessages).length-1;i>=0;i--)$(".message-body span").html($(".message-body span").html()+"<br><br><i><b>"+messageList[e].threadedMessages[i].time+", "+messageList[e].threadedMessages[i].date+"</b></i>"),$(".message-body span").html($(".message-body span").html()+"<br><i>"+messageList[e].threadedMessages[i].body+"</i>");"inbox"==category.data("thetitle").toLowerCase()&&checkUnread()}function openFirst(){(selectedMessage=$(".message-wrapper:first")).length?openMessage():("inbox"==category.data("thetitle").toLowerCase()&&checkUnread(),clearBody())}function moveMessage(e){var a=function(){moveMessage_API(selectedMessage.data("thekey"),category.data("thetitle"),"restore"==e.toLowerCase()?"inbox":""),selectedMessage.remove(),clearBody(),openFirst()},t={alertType:"danger",content:"Warning: This will permanently delete the selected message!",primaryActionText:"delete",secondaryActionText:"cancel",primaryAction:a,secondaryAction:""};"delete"!=e||"trash"!=category.data("thetitle").toLowerCase()&&"sent"!=category.data("thetitle").toLowerCase()?a():callModal(t)}function clearBody(){$(".email-message").hide(),$(".message-info .line-1 span:last").text(""),$(".message-info .line-2 span:last").text(""),$(".message-info .line-3 span:last").text(""),$(".message-body span").text(""),selectedMessage=""}function checkUnread(){unreadCount=0,$.each(messageList,function(e,a){a.unread&&unreadCount++}),(unreadCount=unreadCount>99?99:unreadCount)>0?$(".navigation-button .unread-count").show():$(".navigation-button .unread-count").hide(),$(".navigation-button .unread-count span").text(unreadCount)}function initReply(){var e=selectedMessage.data("thekey");replying=!0,$(".column-2a").hide(),$(".column-2b").hide(),$(".column-2c").addClass("reply-message-active"),$(".column-2 .header span").text("Compose Message"),$(".reply-info .line-1 span:last").text(messageList[e].person),$(".reply-info .line-2 span:last").text("RE: "+messageList[e].subject),$(".reply-body > div:first").text(""),$(".reply-body > div:first").focus(),$(".reply-actions-panel").show()}function closeReply(){replying=!1,$(".column-2c").removeClass("reply-message-active"),$(".reply-actions-panel").hide(),$(".column-2a").show(),$(".column-2b").show()}function sendMessage(){callModal({alertType:"confirmation",content:"Send the current message?",primaryActionText:"send",secondaryActionText:"return",primaryAction:function(){sendMessage_API(selectedMessage.data("thekey"),$(".reply-body div").text()),replying=!1,changeCategory()},secondaryAction:""})}function openAttachment(){callModal({alertType:"information",content:callImage_API(),primaryActionText:"close",secondaryActionText:"",primaryAction:"",secondaryAction:""})}function callModal(e){var a={information:"primary-button-blue",confirmation:"primary-button-green",warning:"primary-button-orange",danger:"primary-button-red"};e.alertType=e.alertType.toLowerCase(),""!=e.content&&""!=e.alertType&&""!=e.primaryActionText&&($(".blackout-wrapper").show(),$(".modal-content-wrapper").addClass("modal-active"),e.content.indexOf("data:image")>=0?($(".modal-content-wrapper").addClass("large-modal"),$(".modal-content-wrapper .modal-message-wrapper").hide(),$(".modal-content-wrapper .modal-image").show(),$(".modal-content-wrapper .modal-image").attr("src",e.content)):($(".modal-content-wrapper").addClass("small-modal"),$(".modal-content-wrapper .modal-image").hide(),$(".modal-content-wrapper .modal-message-wrapper").show(),$(".modal-content-wrapper .modal-message-wrapper").text(e.content)),$('.modal-content-wrapper button[data-theactiontype="1"]').text(e.primaryActionText),$('.modal-content-wrapper button[data-theactiontype="1"]').addClass(a[e.alertType]),""!=e.secondaryActionText?($('.modal-content-wrapper button[data-theactiontype="2"]').show(),$('.modal-content-wrapper button[data-theactiontype="2"]').text(e.secondaryActionText)):$('.modal-content-wrapper button[data-theactiontype="2"]').hide(),$(".app-wrapper").one("click touch",".modal-content-wrapper button",function(){1==$(this).data("theactiontype")?(closeModal(),""!=e.primaryAction&&e.primaryAction()):2==$(this).data("theactiontype")&&(closeModal(),""!=e.secondaryAction&&e.secondaryAction()),$('.modal-content-wrapper button[data-theactiontype="1"]').removeClass(a[e.alertType]),$('.modal-content-wrapper button[data-theactiontype="1"]').text(""),$('.modal-content-wrapper button[data-theactiontype="2"]').text(""),$(".modal-content-wrapper").removeClass("small-modal"),$(".modal-content-wrapper").removeClass("large-modal")}))}function closeModal(){$(".modal-content-wrapper").removeClass("modal-active"),$(".blackout-wrapper").hide()}function scrollBody(){setTimeout(function(){console.log("scroll"),$(".column-2c").scrollTop(9999999),scrolled=!1},50),scrolled=!0}var category,previousCategory,selectedMessage,unreadCount=0,replying=!1,scrolled=!1;$(document).ready(function(){initMessaging(),$(".app-wrapper").on("click touch",".navigation-button",function(){previousCategory=category,category=$(this),changeCategory()}),$(".app-wrapper").on("click touch",".message-wrapper",function(){selectedMessage=$(this),openMessage()}),$(".app-wrapper").on("click touch",".message-info .line-3 span:last",function(){openAttachment()}),$(".app-wrapper").on("click touch",".message-actions .action-1",function(){initReply()}),$(".app-wrapper").on("click touch",".message-actions .action-3",function(){moveMessage("delete")}),$(".app-wrapper").on("click touch",".message-actions .action-2",function(){moveMessage("restore")}),$(".app-wrapper").on("click touch",".reply-actions-panel button",function(){sendMessage()}),$(".app-wrapper").on("keyup",".reply-body",function(){scrolled||scrollBody()})});