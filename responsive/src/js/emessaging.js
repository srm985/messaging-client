var category,
    previousCategory,
    selectedMessage,
    unreadCount = 0,
    replying = false,
    scrolled = false,
    resizeTimerActive = false,
    deviceType,
    mobileBreakpoint = 1024,
    tapHold = false;

$(document).ready(function() {
    initMessaging();

    //*****Select Category*****
    $('.app-container').on('click touch', '.navigation-button', function() {
        previousCategory = category;
        category = $(this);
        changeCategory();
    });

    //*****Buy Stamps*****
    $('.app-container').on('click touch', '.logo-section button', function() {
        previousCategory = category;
        category = $('.navigation-button:first');
        changeCategory();
    });

    //*****Open Message*****
    $('.app-container').on('click touch', '.message-thumbnail', function() {
        selectedMessage = $(this);
        openMessage();
    });

    //*****Open Attachment*****
    $('.app-container').on('click touch', '.image-link', function() {
        openAttachment($(this).text());
    });

    //*****Reply Message*****
    $('.app-container').on('click touch', '.header-actions .action-1', function() {
        initReply();
    });

    //*****Transaction History*****
    $('.app-container').on('click touch', '.column-2-header p', function() {
        stampHistory();
    });

    //*****Restore Message*****
    $('.app-container').on('click touch', '.header-actions .action-2', function() {
        moveMessage('restore');
    });

    //*****Delete Message*****
    $('.app-container').on('click touch', '.header-actions .action-3', function() {
        moveMessage('delete');
    });

    //*****Bulk Delete*****
    $('.app-container').on('click touch', '.bulk-action-1', function() {
        bulkDelete();
    });

    //*****Swipe Delete Message*****
    $('.app-container .column-2a ul').on('swiperight', 'li', function() {
        $('.swipe-delete').removeClass('swipe-delete');
        $(this).addClass('swipe-delete');

        $('.swipe-delete').one('swipeleft', function() {
            $(this).removeClass('swipe-delete');
        });

        $('.app-container .column-2a ul li').on('click touch', 'div:first', function(e) {
            e.stopImmediatePropagation();
            selectedMessage = $('.swipe-delete');
            moveMessage('delete');
        });
    });

    //*****Monitor Typing*****
    $('.app-container').on('input', '.reply-body', function() {
        if (!scrolled) {
            scrollBody();
        }
    });

    //*****Batch Select*****
    $('.app-container').on('click touch', '.message-thumbnail input', function(e) {
        e.stopImmediatePropagation();
        if ($('.message-thumbnail input:checked').length) {
            $('.column-2-header span:nth(1)').show();
        } else {
            $('.column-2-header span:nth(1)').hide();
        }
    });

    //*****Table Row Select*****
    $('.app-container').on('click touch', '.contact-list-card tr, .contacts-search-results-card tr', function() {
        $(this).find('input[type=radio]').prop('checked', true);
        $(this).find('input[type=checkbox]').prop('checked', !$(this).find('input[type=checkbox]').prop('checked'));
        $('.actions-panel button').prop('disabled', false);
        if (deviceType == 'desktop' && $('.contact-list-card').is(':visible')) {
            $('.bulk-action-1').show();
        }
        if (deviceType == 'mobile') {
            $('.selected-table-element').removeClass('selected-table-element');
            $(this).addClass('selected-table-element');
        }
    });

    //*****Window Resize*****
    $(window).resize(function() {
        checkDevice();
    });
});

//********************************************************************************************************
//*                                 Initialize messaging application.                                    *
//********************************************************************************************************
function initMessaging() {
    $('.app-container .blackout-wrapper').hide();
    $('.column-2-header span:nth(1)').hide();
    checkDevice();
    mockData_API();
    category = $('.app-container .navigation-button:nth(2)');
    previousCategory = category;
    changeCategory();
    setInterval(checkUnread(), 5000); //Monitor new messages.
}

//********************************************************************************************************
//*                      Swap between categories such as Inbox, Sent, and Trash.                         *
//********************************************************************************************************
function changeCategory() {
    var categoryName = category.data('thetitle'),
        changeCategoryFunction = function() {
            prep2C();
            $('.column-2c').hide();
            if (categoryName.toLowerCase() != 'contacts' && categoryName.toLowerCase() != 'stamps') {
                callCategory_API(categoryName);
                closeReply();

                if (categoryName.toLowerCase() == 'sent') {
                    $('.message-card-header .header-line-1 span:first').text('To');
                } else {
                    $('.message-card-header .header-line-1 span:first').text('From');
                }
                $('.column-2a ul').empty();
                $.each(messageList, function(i, value) {
                    appendMessage(i, value);
                });
                openFirst();
                $('.app-container .column-2-header span:first').text(categoryName);
            } else if (categoryName.toLowerCase() == 'contacts') {
                contactsPopulate();
            } else if (categoryName.toLowerCase() == 'stamps') {
                purchaseStamps();
            }
            $('.navigation-button').removeClass('navigation-button-selected');
            category.addClass('navigation-button-selected');
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

    checkUnread();
    $('.column-2-header > p span:first').text('Stamps');
    $('.column-2-header > p span:last').text(queryStamps_API());
}

//********************************************************************************************************
//*                                  Query and load our contact list.                                    *
//********************************************************************************************************
function contactsPopulate() {
    var contactTable = $('.contact-list-card'),
        contactList,
        contactID;

    contactList = queryContacts_API();

    prep2C();
    contactTable.show();
    $('.contact-list-actions').show();
    $('.contact-list-actions button').prop('disabled', 'true');
    $('.column-2-header span:first').text('Contacts');
    contactTable.empty();
    if ($.isEmptyObject(contactList)) {
        contactTable.hide();
        $('.blank-canvas').show();
        $('.blank-canvas').text('You currently have no contacts saved. Please add a contact to send a message.');
    } else {
        contactTable.show();
        $('.blank-canvas').hide();
        $('.blank-canvas').text('');
        contactTable.append('<tr><th></th><th>Contact</th><th>Facility</th></tr>');
    }

    if (deviceType == 'desktop') {
        $.each(contactList, function(i, value) {
            contactTable.append('<tr data-theContactID="' + i + '"><td><input type="radio" name="contact"></td><td>' + value.contact + '</td><td>' + value.facility + '</td></tr>');
        });
    } else if (deviceType == 'mobile') {
        $.each(contactList, function(i, value) {
            contactTable.append('<tr data-theContactID="' + i + '"><td><input type="radio" name="contact"></td><td>' + value.contact + '<br><i>' + value.facility + '</i></td><td></td></tr>');
        });
    }

    $('.contact-list-actions').on('click touch', 'button', function(e) {
        e.stopImmediatePropagation();
        contactID = $('.contact-list-card tr input:checked').parent().parent().data('thecontactid');
        initReply(contactID);
    });
    $('.contact-list-actions').one('click touch', 'p', function() {
        contactSearch();
    });
}

//********************************************************************************************************
//*                                      Search for a new contact.                                       *
//********************************************************************************************************
function contactSearch() {
    var searchParameters;

    prep2C();
    $('.contact-search-card input').val('');
    $('.contact-search-card').show();
    $('.search-contact-actions').show();
    $('.search-contact-actions button').prop('disabled', '');
    $('.column-2-header span:first').text('Add Contact');

    $('.search-contact-actions').one('click touch', 'p', function() {
        contactsPopulate();
    });
    $('.search-contact-actions').one('click touch', 'button', function() {
        searchParameters = { facilityState: $('.contact-search-card input[name="facilityState"]').val(''), facilityName: $('.contact-search-card input[name="facilityName"]').val(''), firstName: $('.contact-search-card input[name="firstName"]').val(''), lastName: $('.contact-search-card input[name="lastName"]').val(''), inmateID: $('.contact-search-card input[name="inmateID"]').val('') };
        showContactSearch(searchParameters);
    });
}

//********************************************************************************************************
//*                                   Display and add new contact.                                       *
//********************************************************************************************************
function showContactSearch(searchParameters) {
    var resultsTable = $('.contact-search-results-card'),
        inmateResults,
        uniqueID;

    inmateResults = searchInmates_API(searchParameters);

    prep2C();
    resultsTable.show();
    $('.add-contact-actions').show();
    resultsTable.empty();
    if ($.isEmptyObject(inmateResults)) {
        resultsTable.hide();
        $('.blank-canvas').show();
        $('.blank-canvas').text('Your search criteria returned no contacts.');
    } else {
        resultsTable.show();
        $('.blank-canvas').hide();
        $('.blank-canvas').text('');
        resultsTable.append('<tr><th></th><th>Inmate</th><th>Facility</th></tr>');
    }

    if (deviceType == 'desktop') {
        $.each(inmateResults, function(i, value) {
            resultsTable.append('<tr data-thecontactID="' + i + '"><td><input type="radio" name="contact"></td><td>' + value.contact + '</td><td>' + value.facility + '</td></tr>');
        });
    } else if (deviceType == 'mobile') {
        $.each(inmateResults, function(i, value) {
            resultsTable.append('<tr data-thecontactID="' + i + '"><td><input type="radio" name="contact"></td><td>' + value.contact + '<br><i>' + value.facility + '</i></td><td></td></tr>');
        });
    }

    $('.add-contact-actions').one('click touch', 'p', function() {
        contactSearch();
    });
    $('.add-contact-actions').one('click touch', 'button', function() {
        uniqueID = $('.contact-search-results-card tr input:checked').parent().parent().data('thecontactid');
        addContact_API(uniqueID);
        contactsPopulate();
    });
}


//********************************************************************************************************
//*                                   Populate our list of messages.                                     *
//********************************************************************************************************
function appendMessage(messageKey, messageObject) {
    var showAttachment = messageObject.attachment != '' ? "icons8-attach" : '',
        markUnread = messageObject.unread == 1 ? ' unread-message' : '';
    $('.column-2a ul').append('<li class="message-thumbnail' + markUnread + '" data-thekey="' + messageKey + '"><div><i class="icons8-delete-2"></i></div><div><div><input type="checkbox"><span class="email-receipt-time">' + messageObject.time + '</span><p><span>' + messageObject.person + '</span>&nbsp;<i class="' + showAttachment + '"></i></p><p><span>' + messageObject.subject + '</span>&nbsp;-&nbsp;<span>' + messageObject.body + '</span></p></div></div></li>');
}

//********************************************************************************************************
//*                                Open the body of our selected message.                                *
//********************************************************************************************************
function openMessage() {
    var messageKey = selectedMessage.data('thekey');

    if (deviceType == 'mobile') {
        $('.column-2a').hide();
        $('.column-2b').show();
    }
    $('.message-card').show();
    $('.message-thumbnail-selected').removeClass('message-thumbnail-selected');
    selectedMessage.removeClass('unread-message');

    messageList[messageKey]['unread'] = 0;

    selectedMessage.addClass('message-thumbnail-selected');
    $('.message-card-header .header-line-1 span:last').text(messageList[messageKey]['person']);
    $('.message-card-header .header-line-2 span:last').text(messageList[messageKey]['subject']);

    if (messageList[messageKey]['attachment'] != '') {
        $('.message-card-header .header-line-3 span:last').text(messageList[messageKey]['attachment']);
        $('.message-card-header .header-line-3').show();
    } else {
        $('.header-line-3').hide();
    }

    if (category.data('thetitle').toLowerCase() == 'trash') {
        $('.action-1').hide();
        $('.action-2').show();
    } else {
        $('.action-1').show();
        $('.action-2').hide();
    }

    $('.message-body').html(messageList[messageKey]['body']);

    if (Object.keys(messageList[messageKey]['threadedMessages']).length) {
        for (i = Object.keys(messageList[messageKey]['threadedMessages']).length - 1; i >= 0; i--) {
            $('.message-body').html($('.message-body').html() + '<br><br><br><div class="threaded-message-break"></div><br><i><b>' + messageList[messageKey]['threadedMessages'][i]['time'] + ', ' + messageList[messageKey]['threadedMessages'][i]['date'] + '</b></i>');
            if (messageList[messageKey]['threadedMessages'][i]['attachment'] != '') {
                $('.message-body').html($('.message-body').html() + '<br><i><b>Attachment:&nbsp;<span class="inline-attachment image-link">' + messageList[messageKey]['threadedMessages'][i]['attachment'] + '</span></b></i>');
            }
            $('.message-body').html($('.message-body').html() + '<br><i>' + messageList[messageKey]['threadedMessages'][i]['body'] + '</i>');
        }
    }

    checkUnread();
}

//********************************************************************************************************
//*                                      Open first available message.                                   *
//********************************************************************************************************
function openFirst() {
    selectedMessage = $('.message-thumbnail:first');
    if (deviceType == 'desktop') {
        $('.column-2b').show();
        if (selectedMessage.length) {
            openMessage();
        } else {
            checkUnread();
            clearBody();
        }
    } else if (deviceType == 'mobile') {
        $('.column-2b').hide();
        $('.column-2c').removeClass('column-active');
        $('.column-2a').show();
    }
}

//********************************************************************************************************
//*                              Move the currently selected message.                                    *
//********************************************************************************************************
function moveMessage(action, actionType) {
    var moveFunction = function() {
            if (actionType === undefined) {
                moveMessage_API(selectedMessage.data('thekey'), category.data('thetitle'), action.toLowerCase() == 'restore' ? 'inbox' : '');
                selectedMessage.remove();
            } else if (actionType == 'bulk') {
                $('.message-thumbnail input:checked').each(function() {
                    moveMessage_API($(this).parent().parent().parent().data('thekey'), category.data('thetitle'), action.toLowerCase() == 'restore' ? 'inbox' : '');
                    $(this).parent().parent().remove();
                });
            }
            clearBody();
            openFirst();
        },
        modalObject = { 'alertType': 'danger', 'content': 'Warning: This will permanently delete the selected message(s)!', 'primaryActionText': 'delete', 'secondaryActionText': 'cancel', 'primaryAction': moveFunction, 'secondaryAction': '' };

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
    $('.message-card').hide();
    $('.message-card-header .header-line-1 span:last').text('');
    $('.message-card-header .header-line-2 span:last').text('');
    $('.message-card-header .header-line-3 span:last').text('');
    $('.message-body').text('');
    selectedMessage = '';
}

//********************************************************************************************************
//*                               Check and display unread messages.                                     *
//********************************************************************************************************
function checkUnread() {
    var unreadCount;

    unreadCount = returnUnread_API();
    unreadCount = unreadCount > 99 ? 99 : unreadCount;

    if (unreadCount > 0) {
        $('.navigation-button .unread-email-count').text(unreadCount);
        $('.navigation-button:nth(2)').css('font-weight', 'bold');
    } else {
        $('.navigation-button .unread-email-count').text('');
        $('.navigation-button:nth(2)').css('font-weight', 'normal');
    }
}

//********************************************************************************************************
//*                                        Reply to a message.                                           *
//********************************************************************************************************
function initReply(contactID) {
    var messageKey,
        contact,
        useCounter;

    prep2C();
    replying = true;
    $('.column-2c .email-reply').show();
    $('.message-reply-actions').show();
    $('#attachment-form').val('');
    $('.reply-info .line-3 span:nth(1)').text('');
    $('.attachment-remove-button').hide();
    $('.message-reply-actions input').prop('checked', false);
    $('.column-2-header p span:first').text('Using');
    $('.column-2-header p span:last').text('0 of ' + queryStamps_API() + ' Stamp(s)');

    $('.navigation-button').removeClass('navigation-button-selected');
    $('.column-2-header span:first').text('Compose');
    $('.reply-body > div:first').text('');

    if (contactID !== undefined) {
        contact = returnContact_API(contactID);
        $('.reply-info .line-1 span:last').text(contact.contact);
        $('.reply-info .line-2 span:last').text('');
        $('.reply-info .line-2 span:last').prop('contenteditable', 'true');
        $('.reply-info .line-2 span:last').focus();
    } else {
        messageKey = selectedMessage.data('thekey');
        $('.reply-info .line-1 span:last').text(messageList[messageKey]['person']);
        $('.reply-info .line-2 span:last').text('RE: ' + messageList[messageKey]['subject']);
        $('.reply-info .line-2 span:last').prop('contenteditable', 'false');
        $('.reply-body > div:first').focus();
    }

    //*****Kepp Stamp Usage Updated*****
    $('.app-container').on('change input', '.reply-body > div, #attachment-form, .message-reply-actions input', function() {
        useCounter = 0;

        useCounter += $('.app-container .reply-body > div').text().length ? 1 : 0;
        useCounter += $('.app-container #attachment-form').val().length ? 1 : 0;
        useCounter += $('.app-container .message-reply-actions input').is(':checked') ? 1 : 0;

        $('.column-2-header p span:last').text(useCounter + ' of ' + queryStamps_API() + ' Stamp(s)')
    });

    //*****Handle Attachment*****
    $('.app-container').on('change', '.email-reply #attachment-form', function(e) {
        e.stopImmediatePropagation();
        var fileName;
        if ($('#attachment-form').val().length) {
            fileName = $(this).val().toLowerCase().replace(/\\/g, '&&&');
            fileName = fileName.search('&&&') > 0 ? fileName.slice(fileName.lastIndexOf('&&&') + 3, fileName.length) : fileName;
            $('.reply-info .line-3 span:nth(1)').text(fileName);
            $('.attachment-button').hide();
            $('.attachment-remove-button').show();
            $('.reply-body > div:first').focus();
        } else {
            $('.reply-info .line-3 span:nth(1)').text('');
            $('.attachment-remove-button').hide()
            $('.attachment-button').show();;
        }
    });

    //*****Handle Remove Attachment*****
    $('.app-container').on('click touch', '.attachment-remove-button', function(e) {
        e.stopImmediatePropagation();
        $('#attachment-form').val('').change();
    });

    //*****Send Message*****
    $('.app-container').on('click touch', '.message-reply-actions button', function(e) {
        e.stopImmediatePropagation();
        sendMessage(contactID, useCounter);
    });
}

//********************************************************************************************************
//*                       Close and potentially archive a reply message.                                 *
//********************************************************************************************************
function closeReply() {
    replying = false;
    $('.column-2c').removeClass('column-active');
    $('.actions-panel').hide();
    $('.column-2a').show();
    if (deviceType == 'desktop') {
        $('.column-2b').show();
    } else if (deviceType == 'mobile') {
        $('.column-2b').hide();
    }
}

//********************************************************************************************************
//*                                        Send our message.                                             *
//********************************************************************************************************
function sendMessage(contactID, stampQuantity) {
    var sendInfo,
        sendFunction = function() {
            if (contactID !== undefined) {
                sendInfo = { contactID: contactID, subject: $('.reply-info .line-2 span:last').text() }
            } else {
                sendInfo = { messageID: selectedMessage.data('thekey') };
            }
            sendInfo['attachment'] = $('.reply-info line-3 span:last').text();
            sendInfo['body'] = $('.reply-body div').text();
            sendInfo['stampQuantity'] = stampQuantity;
            sendMessage_API(sendInfo);
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

        $('.app-container').one('click touch', '.modal-content-wrapper button', function() {
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

        if ($('.reply-body > div > span').offset().top >= $('.actions-panel').offset().top - (3 * fontSize)) {
            $('.column-2c').scrollTop($('.column-2c').scrollTop() + (3 * fontSize));
        }

        $('.reply-body span').remove();
        scrolled = false;
    }, 50);

    scrolled = true;
}

//********************************************************************************************************
//*               Determine if we're displaying on desktop, tablet, or mobile.                           *
//********************************************************************************************************
function checkDevice() {
    var previousDevice;

    if (deviceType === undefined && $(window).width() <= mobileBreakpoint) {
        deviceType = 'mobile';
    } else if (deviceType === undefined) {
        deviceType = 'desktop';
    }

    previousDevice = deviceType;

    if (!resizeTimerActive) {
        resizeTimerActive = true;

        if ($(window).width() <= mobileBreakpoint) {
            deviceType = 'mobile';
        } else {
            deviceType = 'desktop';
        }
        if (previousDevice != deviceType) {
            deviceConfig();
        }
        setTimeout(function() {
            resizeTimerActive = false;
        }, 50);
    }
}

//********************************************************************************************************
//*                         Configure functionality based on device type.                                *
//********************************************************************************************************
function deviceConfig() {
    var currentCategory = category.data('thetitle').toLowerCase();
    if (deviceType == 'mobile') {
        $('.bulk-action-1').hide();
    } else if (deviceType == 'desktop') {
        if ((currentCategory == 'inbox' || currentCategory == 'sent' || currentCategory == 'drafts' || currentCategory == 'trash') && !$('.column-2c').is(':visible')) {
            $('.column-2a').show();
            $('.column-2b').show();
            $('.column-2b').css('display', 'inline-block');
            openMessage();
        }
    }
    if ($('.column-2c .contact-list-card').is(':visible')) {
        contactsPopulate();
    } else if ($('.column-2c .contact-search-card').is(':visible')) {
        contactSearch();
    }
}

//********************************************************************************************************
//*                                  Prepare column-2c for use.                                          *
//********************************************************************************************************
function prep2C() {
    closeReply();
    $('.column-2a').hide();
    $('.column-2b').hide();
    $('.column-2c').show();
    $('.column-2c > *').hide();
    $('.column-2c').addClass('column-active');
    $('.actions-panel').show();
    $('.actions-panel > *').hide();
    $('.bulk-action').hide();
}

//********************************************************************************************************
//*                                 Handle bulk delete events.                                           *
//********************************************************************************************************
function bulkDelete() {
    var categoryName = category.data('thetitle').toLowerCase(),
        uniqueID,
        deleteFunction,
        cancelFunction,
        modalObject;

    switch (categoryName) {
        case 'inbox':
            moveMessage('delete', 'bulk');
            break;
        case 'sent':
            moveMessage('delete', 'bulk');
            break;
        case 'drafts':
            moveMessage('delete', 'bulk');
            break;
        case 'trash':
            moveMessage('delete', 'bulk');
            break;
        case 'contacts':
            deleteFunction = function() {
                uniqueID = $('.contact-list-card tr input:checked').parent().parent().data('thecontactid');
                removeContact_API(uniqueID);
                contactsPopulate();
            };
            cancelFunction = function() {
                $('.column-2-header span:nth(1)').show();
            }
            modalObject = { 'alertType': 'danger', 'content': 'Warning: This will permanently delete the selected contact(s)!', 'primaryActionText': 'delete', 'secondaryActionText': 'cancel', 'primaryAction': deleteFunction, 'secondaryAction': cancelFunction };
            callModal(modalObject);
            break;
    }
    $('.column-2-header span:nth(1)').hide();
}

//********************************************************************************************************
//*                                 Purchase stamps function.                                            *
//********************************************************************************************************
function purchaseStamps() {
    var contactList,
        cardList,
        stampsCard,
        modalObject;

    stampsCard = $('.column-2c .purchase-stamps-card');

    prep2C();
    stampsCard.show();
    stampsCard.find('.new-card-section').hide();
    $('.actions-panel .purchase-stamps-actions').show();
    $('.actions-panel button').prop('disabled', 'disabled');
    stampsCard.find('.new-card').show();
    stampsCard.find('form')[0].reset();
    stampsCard.find('.stamps-chunk').empty();

    $('.column-2-header span:first').text('Purchase Stamps');

    contactList = queryContacts_API();
    cardList = returnCreditCards_API();

    if ($.isEmptyObject(contactList)) {
        stampsCard.hide();
        $('.blank-canvas').show();
        $('.blank-canvas').html('You currently have no contacts saved. Please <span class="add-contact-link">add a contact</span> prior to purchasing stamps. Stamp rates vary based on facility.');
    } else {
        stampsCard.show();
        $('.blank-canvas').hide();
        $('.blank-canvas').text('');
        stampsCard.find('.inmate-name-chunk select').empty();
        stampsCard.find('.inmate-name-chunk select').append($('<option />').val(null).text('Select Inmate'));
        $.each(contactList, function(i, value) {
            stampsCard.find('.inmate-name-chunk select').append($('<option />').val(i).text(value.contact + ' (' + value.facility + ')'));
        });
        stampsCard.find('.saved-card-chunk select').empty();
        stampsCard.find('.saved-card-chunk select').append($('<option />').val(null).text('Select Card'));
        $.each(cardList, function(i, value) {
            stampsCard.find('.saved-card-chunk select').append($('<option />').val(i).text(value.number));
        });

        stampsCard.find('.state-chunk select').empty();
        stampsCard.find('.state-chunk select').append($('<option />').val(null).text('Select State'));
        $.each(stateListJSON, function(i, value) {
            stampsCard.find('.state-chunk select').append($('<option />').val(value.abbreviation).text(value.name));
        });
    }

    //*****New Contact Redirect*****
    $('.app-container').on('click touch', '.add-contact-link', function(e) {
        e.stopImmediatePropagation();
        category = $('.app-container .controls-section li:nth(1)');
        changeCategory();
        contactSearch();
    });

    //*****Display Stamp Rates*****
    $('.app-container').on('change', '.inmate-name-chunk select', function() {
        var inmateInformation;

        inmateInformation = returnContact_API($(this).val());
        stampsCard.find('.stamps-chunk').empty();
        $.each(inmateInformation.stamps, function(i, value) {
            stampsCard.find('.stamps-chunk').append('<label><input type="radio" name="stampCount" value="' + i + '""><span>' + i + ' Stamps ($' + value + ')</span></label><br>');
        });
    })

    //*****Add New Card Listener*****
    $('.app-container').on('click touch', '.new-card', function(e) {
        e.stopImmediatePropagation();
        stampsCard.find('.new-card').hide();
        stampsCard.find('.new-card-section').show();
    });

    //*****Saved Card Selected Listener*****
    $('.app-container').on('change', '.saved-card-chunk select', function(e) {
        e.stopImmediatePropagation();
        if ($(this).val() != '') {
            stampsCard.find('.new-card-section').hide();
            stampsCard.find('.new-card').show();
            $('.actions-panel button').prop('disabled', '');
        } else {
            $('.actions-panel button').prop('disabled', 'disabled');
        }
    });

    //*****Cancel Purchase Listener*****
    $('.purchase-stamps-actions').on('click Touch', 'p', function(e) {
        e.stopImmediatePropagation();
        stampsCard.find('form')[0].reset();
        category = previousCategory;
        stampsCard.find('.stamps-chunk').empty();
        changeCategory();
    });

    //*****Complete Transaction*****
    $('.purchase-stamps-actions').on('click touch', 'button', function(e) {
        e.stopImmediatePropagation();
        var formValues = {},
            purchaseFunction;

        $.each(stampsCard.find('form').serializeArray(), function(i, field) {
            formValues[field.name] = field.value;
        });

        purchaseFunction = function() {
            purchaseStamps_API(formValues);
            stampsCard.find('form')[0].reset();
            category = $('.app-container .controls-section li:nth(2)');
            stampsCard.find('.stamps-chunk').empty();
            changeCategory();
        };
        modalObject = { 'alertType': 'confirmation', 'content': 'Proceed with your purchase?', 'primaryActionText': 'purchase', 'secondaryActionText': 'cancel', 'primaryAction': purchaseFunction, 'secondaryAction': '' };
        callModal(modalObject);
    });
}

//********************************************************************************************************
//*                              Display our transaction history.                                        *
//********************************************************************************************************
function stampHistory() {
    var stampTransactionCard = $('.column-2c .stamp-transaction-card'),
        transactionHistory;

    transactionHistory = returnTransactionHistory_API();

    prep2C();
    $('.column-2-header span:first').text('Stamp History');
    $('.column-2-header p span:first').text('Stamps');
    $('.column-2-header p span:last').text(queryStamps_API);
    stampTransactionCard.show();
    $('.stamp-history-actions').show();

    stampTransactionCard.empty();
    stampTransactionCard.append('<tr><th>Date</th><th>Type</th><th>Qty.</th></tr>');
    $.each(transactionHistory, function(i, value) {
        stampTransactionCard.append('<tr data-theTransactionID="' + i + '"><td>' + value.date + '</td><td>' + value.transactionType + '</td><td>' + value.quantity + '</td></tr>');
    });

    $('.app-container').one('click touch', '.stamp-history-actions p', function(e) {
        e.stopImmediatePropagation();
        changeCategory();
    });
}