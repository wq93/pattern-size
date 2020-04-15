// 假设基码
var basicSize = 0;
var basicSizeCode = '';
var sizeArr = ['XS', 'S', 'M', 'L', 'XL']
var initTr = '';
var tableData = {}


$('input.pattern-number-checkbox:first').attr("checked", 'checked');

// 设置表头 && 根据头部生成一个空行以便添加
function setThead(data) {
  initTr = ''
  var itemFir = data.item[0];
  basicSizeCode = itemFir.size_base;
  var theadStart = `<tr>
                  <th></th>
                  <th>尺码部位</th>
                  <th>测量方法</th>
                  <th>基码（${itemFir.size_base}）</th>
                  `
  var theadEnd = `<th>误差 <input type="checkbox" class="sync-mistake">同步</th>
              <th>操作</th></tr>`
  // 空行
  initTr += `<tr class='size-item'>
              <td>
                <input type="text" value="" name="" class='w80 part'>
              </td>
              <td>
                <input type="text" value="" name="" class='w80 metering-type'>
              </td>
              <td>
                <input type="number" step="0.01" data-size-base=${itemFir.size_base} value="0" name="" class='w60 basic-code'>
              </td>`
  var theadMiddle = ''
  var jumpArr = itemFir.cList
  for (var i = 0; i < jumpArr.length; i++) {
    var jumpItem = jumpArr[i]
    // 最后一个不需要跳码列
    if (i === jumpArr.length - 1) {
      theadMiddle += `<th>${jumpItem.cm}</th>`
      initTr += ` <td class="${jumpItem.cm === basicSizeCode ? 'basic-size-td' : ''}" data-last-cm=${jumpItem.cm}"></td>`
    } else {
      theadMiddle += `<th class=${jumpItem.cm}>${jumpItem.cm}</th>
              <th>跳码 <input type="checkbox" class="sync-code sync-jump-code-${jumpItem.cm}">同步</th>`
      initTr += ` <td class="${jumpItem.cm === basicSizeCode ? 'basic-size-td' : ''}"></td>
              <td>
                <input type="number" step="0.01" value="" name="" class='w60 jump-code' data-size="${jumpItem.cm}">
              </td>`
    }
  }
  initTr += `<td>
                ±<input type="number"  step="0.01" value="" name="" class='w60 mistake-code'>
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
                <input type="checkbox" class="check-sync">
              </td>
              <td>
                <input type="text" value=${trItem.part} name="" class='w80 part'>
              </td>
              <td>
                <input type="text" value=${trItem.metering_type} name="" class='w80 metering-type'>
              </td>
              <td>
                <input type="number" step="0.01" data-size-base=${trItem.size_base} value=${trItem.size_base_value} name="" class='w60 basic-code'>
              </td>`
    // 循环跳码模块
    for (var j = 0; j < trItemCList.length; j++) {
      var cListItem = trItemCList[j];
      // 最后一个不需要跳码列
      if (j === trItemCList.length - 1) {
        tbodyHtml += ` <td class="${cListItem.cm === basicSizeCode ? 'basic-size-td' : ''}" data-last-cm=${cListItem.cm}">${ cListItem.value || ''}</td>`
      } else {
        tbodyHtml += ` <td class="${cListItem.cm === basicSizeCode ? 'basic-size-td' : ''}">${cListItem.value || ''}</td>
              <td>
                <input type="number" step="0.01" value="${cListItem.tm}" name="" class='w60 jump-code' data-size=${cListItem.cm}>
              </td>`
      }
    }
    tbodyHtml += `<td>
                ±<input type="number" step="0.01"value="${trItem.error}" name="" class='w60 mistake-code'>
              </td>
              <td>
                <button type="button" class="btn btn-danger delete-size-item">删除</button>
              </td>`
  }
  $('#size-table-tbody').html(tbodyHtml)
};

// 根据跳码计算尺码
function computeSize($target) {
  var currentSize = $($target).attr('data-size');
  if (compareElement({basicSize: basicSizeCode, currentSize: currentSize})) {
    // 获取父节点的上一个兄弟节点
    var targetParent = $target.parent('td').next('td');
    var standard = $target.parent('td').prev('td');
    targetParent.html((parseFloat(standard.html()) + parseFloat($target.val())).toFixed(2))
  } else {
    // 获取父节点的上一个兄弟节点
    var targetParent = $target.parent('td').prev('td');
    var standard = $target.parent('td').next('td');
    targetParent.html((parseFloat(standard.html()) - parseFloat($target.val())).toFixed(2))
  }
}

// 获取保持数据
function formatSubmitData() {
  // 获取每一行
  var $trs = $('.size-item');
  var submitData = [];
  // 循环列
  for (var i = 0; i < $trs.length; i++) {
    var trItemData = {}
    var $tr = $($trs[i])
    var cListData = []
    var $cList = $tr.find('.jump-code')
    // 获取最后一个尺码列
    var lastTr = $tr.find('td[data-last-cm]')
    // 循环跳码块
    for (var j = 0; j < $cList.length; j++) {
      var cListItemData = {}
      var $cListItem = $($cList[j]);
      cListItemData = {
        'px': j,
        'tm': $cListItem.val(),
        'cm': $cListItem.attr('data-size'),
        'value': $cListItem.parents('td').prev('td').html() || 0 // 尺码计算值
      }
      cListData.push(cListItemData)
      // 拼上最后一项
      if (j === $cList.length - 1) {
        var cListItemData = {}
        cListItemData = {
          'px': j + 1,
          'tm': 0,
          'cm': $(lastTr).attr('data-last-cm'),
          'value': $(lastTr).html() // 尺码计算值
        }
        cListData.push(cListItemData)
      }
    }
    trItemData = {
      'metering_type': $tr.find('.metering-type').val() || '',
      'part': $tr.find('.part').val() || '',
      'size_base' : $tr.find('.basic-code').attr('data-size-base'),
      'size_base_value': $tr.find('.basic-code').val() || '',
      'error': $tr.find('.mistake-code').val() || '',
      'cList': cListData,
      'id': $('#pattern-id').attr('data-id'),
      'mId': $('#mb-select').val()
    }
    submitData.push(trItemData)
  }
  return submitData;
}
// 选中列事件
$("#size-table").on("change", ".check-sync", function (e) {
  var $target = $(e.target)
  var isChecked = $target.is(':checked');
  $target.parents('tr').attr('is-check-sync-code', isChecked)
});

// 设置全部跳码
$('#set-all-jump-code').click(function (e) {
  var allJumpCode = $('#all-jump-code').val();
  // 设置所有的跳码框
  var $JumpCode = $('#size-table tr[is-check-sync-code=true] .jump-code');
  $JumpCode.val(parseFloat(allJumpCode));
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
  // *********根据是否同步跳码设置同列尺码*********
  // 找到类别
  var sizeType = target.attr('data-size')
  // 是否同步
  var isSync = $('.sync-jump-code-' + sizeType).is(':checked');
  if (isSync) {
    // 获取当前列的跳码框
    var columnJumpCodes = $('.jump-code[data-size=' + sizeType + ']')
    columnJumpCodes.val(target.val())
    // 改变所有的码
    // 获取所有的跳码框并设置尺码
    var $JumpCode = $('#size-table .jump-code');
    for (var i = 0; i < $JumpCode.length; i++) {
      // 获取父节点的上一个兄弟节点
      var $jumpCode = $($JumpCode[i]);
      computeSize($jumpCode)
    }
  } else {
    // 改变这一行的码
    // 获取这行所有的跳码框并设置尺码
    var $JumpCode = target.parents('tr.size-item').find('.jump-code');
    for (var i = 0; i < $JumpCode.length; i++) {
      // 获取父节点的上一个兄弟节点
      var $jumpCode = $($JumpCode[i]);
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
    // 改变这行的基码列
    $jumpCode.parents('tr.size-item').find('.basic-size-td').html(target.val())
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

// 提交
$("#submit-table-btn").click(function (e) {
  console.log(formatSubmitData());
  $.ajax({
    type: "POST",
    url: '/api/platemakingSizePart/addPlatemakingSizePart',
    data: JSON.stringify(formatSubmitData()),
    contentType:'application/x-www-form-urlencoded',
    success: function (data) {
      console.log(data);
    },
    error: function (jqXHR) {
      console.log(jqXHR.status);
    }
  });

})

// 选择尺码模板
$("#mb-select").change(function (e) {
  var target = $(e.currentTarget);
  fetchTableData(target.val())
})

// 获取表格数据
function fetchTableData(id) {
  $.ajax({
    type: "GET",
    url: `/api/templateMaterial//getId/${id}`,
    dataType: "json",
    success: function (data) {
      setThead(data);
      setTbody(data);
    },
    error: function (jqXHR) {
      console.log(jqXHR.status);
      var data = {
        "code": "OK",
        "desc": "OK",
        "item": [
          {
            "metering_type": "c2",
            "cList": [
              {
                "px": 0,
                "tm": 1,
                "cm": "XS",
                "value": 10
              },
              {
                "px": 1,
                "tm": 2,
                "cm": "S",
                "value": 11
              },
              {
                "px": 2,
                "tm": 0,
                "cm": "M",
                "value": 13
              }
            ],
            "part": "c1",
            "mId": 10074,
            "size_base": "XS",
            "error": 3,
            "size_base_value": 10
          },
          {
            "metering_type": "a2",
            "cList": [
              {
                "px": 0,
                "tm": 2,
                "cm": "XS",
                "value": 11
              },
              {
                "px": 1,
                "tm": 3,
                "cm": "S",
                "value": 13
              },
              {
                "px": 2,
                "tm": 0,
                "cm": "M",
                "value": 16
              }
            ],
            "part": "a1",
            "mId": 10074,
            "size_base": null,
            "error": 3,
            "size_base_value": 11
          }
        ],
        "errParam": null,
        "success": true,
        "failed": false
      }
      setThead(data);
      setTbody(data);
    }
  });
}

// 比较两个元素的位置
function compareElement(obj) {
  var basicSize = obj.basicSize;
  var currentSize = obj.currentSize;
  var basicIndex = sizeArr.indexOf(basicSize.toUpperCase())
  var currentIndex = sizeArr.indexOf(currentSize.toUpperCase())
  var sort = currentIndex - basicIndex;
  return sort >= 0
}
