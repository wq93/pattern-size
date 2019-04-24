// 假设基码
var basicSize = 66;
var initTr = ''
var data = {
  "code": "OK",
  "desc": "OK",
  "item": [           //数据item
    {
      "metering_type": "b1",  // 测量方法
      "cList": [
        {
          "px": 0,           // 排序
          "tm": 31,         // 跳码
          "cm": "S"          // 尺码
        },
        {
          "px": 1,
          "tm": 41,
          "cm": "M"
        }
      ],
      "part": "c1",      //尺码部位
      "size_base": "S",  //基码
      "error": 771      //误差
    },
    {
      "metering_type": "b2",
      "cList": [
        {
          "px": 0,
          "tm": 32,
          "cm": "S"
        },
        {
          "px": 1,
          "tm": 42,
          "cm": "M"
        }
      ],
      "part": "c2",
      "size_base": "S",
      "error": 772
    }
  ],
  "errParam": null,
  "success": true,
  "failed": false
}
setThead(data);
setTbody(data);

// 设置表头 && 根据头部生成一个空行以便添加
function setThead(data) {
  var itemFir = data.item[0];
  var theadStart = `<tr><th>尺码部位</th>
                  <th>测量方法</th>
                  <th>基码（${itemFir.size_base}）</th>
                  `
  var theadEnd = `<th>误差 <input type="checkbox" class="sync-mistake">同步</th>
              <th>操作</th></tr>`
  // 空行
  initTr += `<tr class='size-item'>
              <td>
                <input type="text" value="" name="" class='w80'>
              </td>
              <td>
                <input type="text" value="" name="" class='w80'>
              </td>
              <td>
                <input type="number" value="" name="" class='w60 basic-code'>
              </td>`
  var theadMiddle = ''
  var jumpArr = itemFir.cList
  for (var i = 0; i < jumpArr.length; i++) {
    var jumpItem = jumpArr[i]
    theadMiddle += `<th>${jumpItem.cm}</th>
              <th>跳码 <input type="checkbox" class="sync-code sync-jump-code-${jumpItem.cm}">同步</th>`
    initTr += ` <td></td>
              <td>
                <input type="number" value="" name="" class='w60 jump-code' data-size="${jumpItem.cm}">
              </td>`
  }
  initTr += `<td>
                ±<input type="number" value="" name="" class='w60 mistake-code'>
              </td>
              <td>
                <button type="button" class="btn btn-danger delete-size-item">删除</button>
              </td>
          </tr>`
  $('#size-table-thead').html(theadStart + theadMiddle + theadEnd)
}

// 设置表单体
function setTbody(data) {
  var trArr = data.item;
  var tbodyHtml = '';
  for (var i = 0; i < trArr.length; i++) {
    var trItem = trArr[i];
    var trItemCList = trItem.cList;
    tbodyHtml += `<tr class='size-item'>
              <td>
                <input type="text" value=${trItem.part} name="" class='w80'>
              </td>
              <td>
                <input type="text" value=${trItem.metering_type} name="" class='w80'>
              </td>
              <td>
                <input type="number" value=${trItem.size_base} name="" class='w60 basic-code'>
              </td>`
    // 循环跳码模块
    for (var j = 0; j < trItemCList.length; j++) {
      var cListItem = trItemCList[j];
      tbodyHtml += ` <td>${basicSize + cListItem.tm}</td>
              <td>
                <input type="number" value="${cListItem.tm}" name="" class='w60 jump-code' data-size=${cListItem.cm}>
              </td>`
    }
    tbodyHtml += `<td>
                ±<input type="number" value="${trItem.error}" name="" class='w60 mistake-code'>
              </td>
              <td>
                <button type="button" class="btn btn-danger delete-size-item">删除</button>
              </td>`
  }
  $('#size-table-tbody').append(tbodyHtml)
};

// 设置基码
$('.basic-code').val(basicSize)

// 根据跳码计算尺码
function computeSize($target) {
  // 获取父节点的上一个兄弟节点
  var prevParent = $target.parent('td').prev('td');
  // 获取这行的基码的值
  var basicCode = $target.parents('tr.size-item');
  prevParent.html(parseInt(basicCode.find('.basic-code').val()) + parseInt($target.val()))
}

// 设置全部跳码
$('#set-all-jump-code').click(function (e) {
  var allJumpCode = $('#all-jump-code').val();
  // 设置所有的跳码框
  var $JumpCode = $('#size-table .jump-code');
  $JumpCode.val(parseInt(allJumpCode));
  // 获取所有的跳码框并设置尺码
  for (var i = 0; i < $JumpCode.length; i++) {
    // 获取父节点的上一个兄弟节点
    var $jumpCode = $($JumpCode[i]);
    computeSize($jumpCode)
  }
})

// 改变单列跳码的事件
$("#size-table").on("change", ".jump-code", function (e) {
  var target = $(e.currentTarget)
  computeSize(target);

  // *********根据是否同步跳码设置同列尺码*********
  // 找到类别
  var sizeType = target.attr('data-size')
  // 是否同步
  var isSync = $('.sync-jump-code-' + sizeType).is(':checked');
  if (isSync) {
    // 获取当前列的跳码框
    var columnJumpCodes = $('.jump-code[data-size=' + sizeType + ']')
    columnJumpCodes.val(target.val())
    for (var i = 0; i < columnJumpCodes.length; i++) {
      // 获取父节点的上一个兄弟节点
      var $jumpCode = $(columnJumpCodes[i]);
      computeSize($jumpCode)
    }
  }
})

// 改变基码的事件
$("#size-table").on("change", ".basic-code", function (e) {
  var target = $(e.currentTarget)
  // 获取这行的跳码框
  var jumpCodes = target.parents('tr.size-item').find('.jump-code');
  for (var i = 0; i < jumpCodes.length; i++) {
    // 获取父节点的上一个兄弟节点
    var $jumpCode = $(jumpCodes[i]);
    computeSize($jumpCode)
  }
});

// 添加一行
$('#add-tr-item').click(function () {
  $('#size-table-tbody').append(initTr)
})

// 删除
$("#size-table").on("click", ".delete-size-item", function (e) {
  var target = $(e.currentTarget);
  target.parents('tr.size-item').remove();
})

// 同步误差
$("#size-table").on("change", ".mistake-code", function (e) {
  var target = $(e.currentTarget);
  // 是否同步
  var isSync = $('.sync-mistake').is(':checked');
  if (isSync) {
    $('.mistake-code').val(target.val());
  }
})