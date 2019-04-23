// 假设基码
var basicSize = 66;
var trHtml = `<tr class='size-item'>
            <td>
              <input type="text" value="前衣长" name="" class='w80'>
            </td>
            <td>
              <input type="text" value="前肩点至脚边" name="" class='w80'>
            </td>
            <td>
              <input type="number" value="0" name="" class='w60 basic-code'>
            </td>
            <td>0</td>
            <td>
              <input type="number" value="0" name="" class='w60 jump-code' data-size="XS">
            </td>
            <td>0</td>
            <td>
              <input type="number" value="0" name="" class='w60 jump-code' data-size="S">
            </td>
            <td>0</td>
            <td>
              <input type="number" value="0" name="" class='w60 jump-code' data-size="M">
            </td>
            <td>0</td>
            <td>
              <input type="number" value="0" name="" class='w60 jump-code' data-size="L">
            </td>
            <td>
              ±<input type="number" value="0" name="" class='w60 mistake-code'>
            </td>
            <td>
              <button type="button" class="btn btn-danger delete-size-item">删除</button>
            </td>
          </tr>`
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
// 设置表头
function setThead(data) {
  var theadStart= `<th>尺码部位</th>
                  <th>测量方法</th>
                  <th>基码（${data.size_base}）</th>
                  `
  var theadEnd = `<th>误差 <input type="checkbox" class="sync-mistake">同步</th>
              <th>操作</th>`
  var JumpArr =
  for (var i = 0; i < $JumpCode.length; i++) {

  }
}

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
  $('#size-table').append(trHtml)
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