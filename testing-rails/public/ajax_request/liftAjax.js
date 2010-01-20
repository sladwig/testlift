
var lift_ajaxQueue = [];
var lift_ajaxInProcess = null;
var lift_ajaxShowing = false;
var lift_ajaxRetryCount = 3

function lift_ajaxHandler(theData, theSuccess, theFailure) {
  var toSend = {retryCnt: 0};
  toSend.when = (new Date()).getTime();
  toSend.theData = theData;
  toSend.onSuccess = theSuccess;
  toSend.onFailure = theFailure;

  lift_ajaxQueue.push(toSend);
  lift_ajaxQueueSort();
  lift_doAjaxCycle();
  return false; // buttons in forms don't trigger the form
}

function lift_ajaxQueueSort() {
  lift_ajaxQueue.sort(function (a,b) {return a.when - b.when;});
}

function lift_defaultFailure() {
alert('The server cannot be contacted at this time');
}

function lift_startAjax() {
  lift_ajaxShowing = true;

}

function lift_endAjax() {
  lift_ajaxShowing = false;

}

function lift_testAndShowAjax() {
  if (lift_ajaxShowing && lift_ajaxQueue.length == 0 &&
      lift_ajaxInProcess == null) {
   lift_endAjax();
      } else if (!lift_ajaxShowing && (lift_ajaxQueue.length > 0 ||
     lift_ajaxInProcess != null)) {
   lift_startAjax();
     }
}

function lift_traverseAndCall(node, func) {
  if (node.nodeType == 1) func(node);
  var i = 0;
  var cn = node.childNodes;

  for (i = 0; i < cn.length; i++) {
    lift_traverseAndCall(cn.item(i), func);
  }
}

function lift_successRegisterGC() {
  setTimeout("lift_registerGC()", 75000);
}

function lift_failRegisterGC() {
  setTimeout("lift_registerGC()", 15000);
}

function lift_registerGC() {
    var data = "__lift__GC=_"
jQuery.ajax({ url : addPageName('/ajax_request/'), data : data, type : 'POST', dataType : 'script', timeout : 5000, cache : false, success : lift_successRegisterGC, error : lift_failRegisterGC });
}

function lift_doAjaxCycle() {
  var queue = lift_ajaxQueue;
  if (queue.length > 0) {
    var now = (new Date()).getTime();
    if (lift_ajaxInProcess == null && queue[0].when <= now) {
      var aboutToSend = queue.shift();

      lift_ajaxInProcess = aboutToSend;
      var  successFunc = function() {
         lift_ajaxInProcess = null;
         if (aboutToSend.onSuccess) {
           aboutToSend.onSuccess();
         }
         lift_doAjaxCycle();
      };

      var failureFunc = function() {
         lift_ajaxInProcess = null;
         var cnt = aboutToSend.retryCnt;
         if (cnt < lift_ajaxRetryCount) {
	   aboutToSend.retryCnt = cnt + 1;
           var now = (new Date()).getTime();
           aboutToSend.when = now + (1000 * Math.pow(2, cnt));
           queue.push(aboutToSend);
           lift_ajaxQueueSort();
         } else {
           if (aboutToSend.onFailure) {
             aboutToSend.onFailure();
           } else {
             lift_defaultFailure();
           }
         }
         lift_doAjaxCycle();
      };
      lift_actualAjaxCall(aboutToSend.theData, successFunc, failureFunc);
    }
  }

  lift_testAndShowAjax();
  setTimeout("lift_doAjaxCycle();", 200);
}

function lift_blurIfReturn(e) {
  var code;
	if (!e) var e = window.event;
	if (e.keyCode) code = e.keyCode;
	else if (e.which) code = e.which;

  var targ;

	if (e.target) targ = e.target;
	else if (e.srcElement) targ = e.srcElement;
	if (targ.nodeType == 3) // defeat Safari bug
		targ = targ.parentNode;

  if (code == 13) {targ.blur(); return false;} else {return true;};
}

function addPageName(url) {
  return url.replace('ajax_request', 'ajax_request/'+lift_page);
}

function lift_actualAjaxCall(data, onSuccess, onFailure) {
jQuery.ajax({ url : addPageName('/ajax_request/'), data : data, type : 'POST', dataType : 'script', timeout : 5000, cache : false, success : onSuccess, error : onFailure });
}

jQuery(document).ready(function() {lift_doAjaxCycle()});