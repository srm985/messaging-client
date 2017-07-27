var category, previousCategory, selectedMessage, unreadCount = 0,
    replying = false,
    scrolled = false;

$(document).ready(function() {
    initMessaging();

    //*****Select Category*****
    $('.app-wrapper').on('click touch', '.navigation-button', function() {
        previousCategory = category;
        category = $(this);
        changeCategory();
    });

    //*****Open Message*****
    $('.app-wrapper').on('click touch', '.message-wrapper', function() {
        selectedMessage = $(this);
        openMessage();
    });

    //*****Open Attachment*****
    $('.app-wrapper').on('click touch', '.image-link', function() {
        openAttachment($(this).text());
    });

    //*****Reply Message*****
    $('.app-wrapper').on('click touch', '.message-actions .action-1', function() {
        initReply();
    });

    //*****Delete Message*****
    $('.app-wrapper').on('click touch', '.message-actions .action-3', function() {
        moveMessage('delete');
    });

    //*****Restore Message*****
    $('.app-wrapper').on('click touch', '.message-actions .action-2', function() {
        moveMessage('restore');
    });

    //*****Send Message*****
    $('.app-wrapper').on('click touch', '.reply-actions-panel button', function() {
        sendMessage();
    });

    //*****Monitor Typing*****
    $('.app-wrapper').on('input', '.reply-body', function() {
        if (!scrolled) {
            scrollBody();
        }
    });
});

//********************************************************************************************************
//*                                 Initialize messaging application.                                    *
//********************************************************************************************************
function initMessaging() {
    $('.app-wrapper .blackout-wrapper').hide();
    $('.reply-actions-panel').hide();
    mockData_API();
    category = $('.app-wrapper .navigation-button:first');
    changeCategory();
}

//********************************************************************************************************
//*                      Swap between categories such as Inbox, Sent, and Trash.                         *
//********************************************************************************************************
function changeCategory() {
    var categoryName = category.data('thetitle'),
        changeCategoryFunction = function() {
            callCategory_API(categoryName);
            closeReply();

            if (categoryName.toLowerCase() == 'sent') {
                $('.message-info .line-1 span:first').text('To:');
            } else {
                $('.message-info .line-1 span:first').text('From:')
            }
            $('.app-wrapper .header span').text(categoryName);
            $('.navigation-button').removeClass('navigation-button-selected');
            category.addClass('navigation-button-selected');
            $('.column-2a').empty();
            $.each(messageList, function(i, value) {
                appendMessage(i, value);
            });
            openFirst();
        },
        retainCategoryFunction = function() {
            category = previousCategory;
        },
        modalObject = { 'alertType': 'danger', 'content': 'Warning: Your reply message will be discarded!', 'primaryActionText': 'discard', 'secondaryActionText': 'cancel', 'primaryAction': changeCategoryFunction, 'secondaryAction': retainCategoryFunction };

    if (replying) {
        callModal(modalObject);
    } else {
        changeCategoryFunction();
    }
}

//********************************************************************************************************
//*                                     Sort our list of messages.                                       *
//********************************************************************************************************
function sortMessages() {}

//********************************************************************************************************
//*                                   Populate our list of messages.                                     *
//********************************************************************************************************
function appendMessage(messageKey, messageObject) {
    var showAttachment = messageObject.attachment != '' ? "icons8-attach" : '',
        markUnread = messageObject.unread == 1 ? 'unread-message' : '';
    $('.column-2a').append('<div class="message-wrapper ' + markUnread + '" data-theKey="' + messageKey + '""><div class="message-content-wrapper"><ul><li><span class="person">' + messageObject.person + '</span><i class="attachment ' + showAttachment + '"></i><span class="time">' + messageObject.time + '</span></li><li><span class="subject">' + (messageObject.subject + ' - ' + messageObject.body).substr(0, 30) + '...</span></li></ul></div></div>');
}

//********************************************************************************************************
//*                                Open the body of our selected message.                                *
//********************************************************************************************************
function openMessage() {
    var messageKey = selectedMessage.data('thekey');

    console.log(messageList[messageKey]);

    $('.email-message').show();

    $('.message-wrapper').removeClass('message-wrapper-selected');


    selectedMessage.removeClass('unread-message');
    messageList[messageKey]['unread'] = 0;


    selectedMessage.addClass('message-wrapper-selected');
    $('.message-info .line-1 span:last').text(messageList[messageKey]['person']);
    $('.message-info .line-2 span:last').text(messageList[messageKey]['subject']);
    if (messageList[messageKey]['attachment'] != '') {
        $('.message-info .line-3 span:last').text(messageList[messageKey]['attachment']);
        $('.message-info .line-3').show();
    } else {
        $('.message-info .line-3').hide();
    }
    if (messageList[messageKey]['returnPostage']) {
        $('.action-1').show();
    } else {
        $('.action-1').hide();
    }
    if (category.data('thetitle').toLowerCase() == 'trash') {
        $('.action-1').hide();
        $('.action-2').show();
    } else {
        $('.action-2').hide();
    }
    $('.message-body span').html(messageList[messageKey]['body']);

    if (Object.keys(messageList[messageKey]['threadedMessages']).length) {
        for (i = Object.keys(messageList[messageKey]['threadedMessages']).length - 1; i >= 0; i--) {
            $('.message-body span').html($('.message-body span').html() + '<br><br><br><div class="threaded-message-break"></div><br><i><b>' + messageList[messageKey]['threadedMessages'][i]['time'] + ', ' + messageList[messageKey]['threadedMessages'][i]['date'] + '</b></i>');
            if (messageList[messageKey]['threadedMessages'][i]['attachment'] != '') {
                $('.message-body span').html($('.message-body span').html() + '<br><i><b>Attachment:&nbsp;<span class="inline-attachment image-link">' + messageList[messageKey]['threadedMessages'][i]['attachment'] + '</span></b></i>');
            }
            $('.message-body span').html($('.message-body span').html() + '<br><i>' + messageList[messageKey]['threadedMessages'][i]['body'] + '</i>');
        }
    }

    if (category.data('thetitle').toLowerCase() == 'inbox') {
        checkUnread();
    }
}

//********************************************************************************************************
//*                                      Open first available message.                                   *
//********************************************************************************************************
function openFirst() {
    selectedMessage = $('.message-wrapper:first');
    if (selectedMessage.length) {
        openMessage();
    } else {
        if (category.data('thetitle').toLowerCase() == 'inbox') {
            checkUnread();
        }
        clearBody();
    }
}

//********************************************************************************************************
//*                              Move the currently selected message.                                    *
//********************************************************************************************************
function moveMessage(action) {
    var moveFunction = function() {
            moveMessage_API(selectedMessage.data('thekey'), category.data('thetitle'), action.toLowerCase() == 'restore' ? 'inbox' : '');
            selectedMessage.remove();
            clearBody();
            openFirst();
        },
        modalObject = { 'alertType': 'danger', 'content': 'Warning: This will permanently delete the selected message!', 'primaryActionText': 'delete', 'secondaryActionText': 'cancel', 'primaryAction': moveFunction, 'secondaryAction': '' };

    if (action == 'delete' && (category.data('thetitle').toLowerCase() == 'trash' || category.data('thetitle').toLowerCase() == 'sent')) {
        callModal(modalObject);
    } else {
        moveFunction();
    }
}

//********************************************************************************************************
//*                                 Clear and hide the message body.                                     *
//********************************************************************************************************
function clearBody() {
    $('.email-message').hide();
    $('.message-info .line-1 span:last').text('');
    $('.message-info .line-2 span:last').text('');
    $('.message-info .line-3 span:last').text('');
    $('.message-body span').text('');
    selectedMessage = '';
}

//********************************************************************************************************
//*                               Check and display unread messages.                                     *
//********************************************************************************************************
function checkUnread() {
    unreadCount = 0;

    $.each(messageList, function(i, value) {
        if (value.unread) {
            unreadCount++;
        }
    });

    unreadCount = unreadCount > 99 ? 99 : unreadCount;

    if (unreadCount > 0) {
        $('.navigation-button .unread-count').show();
    } else {
        $('.navigation-button .unread-count').hide();
    }

    $('.navigation-button .unread-count span').text(unreadCount);
}

//********************************************************************************************************
//*                                        Reply to a message.                                           *
//********************************************************************************************************
function initReply() {
    var messageKey = selectedMessage.data('thekey');

    replying = true;

    $('.column-2a').hide();
    $('.column-2b').hide();
    $('.column-2c').addClass('reply-message-active');

    $('.column-2 .header span').text('Compose Message');
    $('.reply-info .line-1 span:last').text(messageList[messageKey]['person']);
    $('.reply-info .line-2 span:last').text('RE: ' + messageList[messageKey]['subject']);
    $('.reply-body > div:first').text('');
    $('.reply-body > div:first').focus();

    $('.reply-actions-panel').show();
}

//********************************************************************************************************
//*                       Close and potentially archive a reply message.                                 *
//********************************************************************************************************
function closeReply() {
    replying = false;
    $('.column-2c').removeClass('reply-message-active');
    $('.reply-actions-panel').hide();
    $('.column-2a').show();
    $('.column-2b').show();
}

//********************************************************************************************************
//*                                        Sent our message.                                             *
//********************************************************************************************************
function sendMessage() {
    var sendFunction = function() {
            sendMessage_API(selectedMessage.data('thekey'), $('.reply-body div').text());
            replying = false;
            changeCategory();
        },
        modalObject = { 'alertType': 'confirmation', 'content': 'Send the current message?', 'primaryActionText': 'send', 'secondaryActionText': 'return', 'primaryAction': sendFunction, 'secondaryAction': '' };

    callModal(modalObject);
}

//********************************************************************************************************
//*                                        Open selected attachment.                                     *
//********************************************************************************************************
function openAttachment(image) {
    var imageSource = callImage_API(image),
        modalObject = { 'alertType': 'information', 'content': imageSource, 'primaryActionText': 'close', 'secondaryActionText': '', 'primaryAction': '', 'secondaryAction': '' };

    callModal(modalObject);
}

//********************************************************************************************************
//*                                          Open a modal.                                               *
//********************************************************************************************************
function callModal(modalObject) {
    var alertList = { 'information': 'primary-button-blue', 'confirmation': 'primary-button-green', 'warning': 'primary-button-orange', 'danger': 'primary-button-red' };

    modalObject.alertType = modalObject.alertType.toLowerCase();

    if (modalObject.content != '' && modalObject.alertType != '' && modalObject.primaryActionText != '') {

        $('.blackout-wrapper').show();
        $('.modal-content-wrapper').addClass('modal-active');

        if (modalObject.content.indexOf('data:image') >= 0) {
            $('.modal-content-wrapper').addClass('large-modal')
            $('.modal-content-wrapper .modal-message-wrapper').hide();
            $('.modal-content-wrapper .modal-image').show();
            $('.modal-content-wrapper .modal-image').attr('src', modalObject.content);
        } else {
            $('.modal-content-wrapper').addClass('small-modal')
            $('.modal-content-wrapper .modal-image').hide();
            $('.modal-content-wrapper .modal-message-wrapper').show();
            $('.modal-content-wrapper .modal-message-wrapper').text(modalObject.content);
        }

        $('.modal-content-wrapper button[data-theactiontype="1"]').text(modalObject.primaryActionText);
        $('.modal-content-wrapper button[data-theactiontype="1"]').addClass(alertList[modalObject.alertType]);
        if (modalObject.secondaryActionText != '') {
            $('.modal-content-wrapper button[data-theactiontype="2"]').show();
            $('.modal-content-wrapper button[data-theactiontype="2"]').text(modalObject.secondaryActionText);
        } else {
            $('.modal-content-wrapper button[data-theactiontype="2"]').hide();
        }

        $('.app-wrapper').one('click touch', '.modal-content-wrapper button', function() {
            if ($(this).data('theactiontype') == 1) {
                closeModal();
                if (modalObject.primaryAction != '') {
                    modalObject.primaryAction();
                }
            } else if ($(this).data('theactiontype') == 2) {
                closeModal();
                if (modalObject.secondaryAction != '') {
                    modalObject.secondaryAction();
                }
            }
            $('.modal-content-wrapper button[data-theactiontype="1"]').removeClass(alertList[modalObject.alertType]);
            $('.modal-content-wrapper button[data-theactiontype="1"]').text('');
            $('.modal-content-wrapper button[data-theactiontype="2"]').text('');
            $('.modal-content-wrapper').removeClass('small-modal');
            $('.modal-content-wrapper').removeClass('large-modal');
        });
    }
}

//********************************************************************************************************
//*                                        Close our modal.                                              *
//********************************************************************************************************
function closeModal() {
    $('.modal-content-wrapper').removeClass('modal-active');
    $('.blackout-wrapper').hide();
}

//********************************************************************************************************
//*                  Keep caret from disappearing below send control panel.                              *
//********************************************************************************************************
function scrollBody() {
    var selection,
        range,
        newElement,
        fragment,
        node,
        fontSize = $('.reply-body > div').css('font-size').replace('px', '');

    setTimeout(function() {
        selection = window.getSelection();
        if (selection.getRangeAt && selection.rangeCount) {
            range = selection.getRangeAt(0);
            newElement = document.createElement("div");
            newElement.innerHTML = '<span></span>';
            fragment = document.createDocumentFragment();
            node = newElement.firstChild;
            fragment.appendChild(node);
            range.insertNode(fragment);
        }

        if ($('.reply-body > div > span').offset().top >= $('.reply-actions-panel').offset().top - (3 * fontSize)) {
            $('.column-2c').scrollTop($('.column-2c').scrollTop() + (3 * fontSize));
        }

        $('.reply-body span').remove();
        scrolled = false;
    }, 50);

    scrolled = true;
}
