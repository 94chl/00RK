$(document).ready(function () {
  let drop = [];
  let item = [];
  let area = [];
  let options = []
  let weapon = [];
  let checkedAOrder = [];
  let sEquip = [];  
  let i,e,o,u;
  let commonD = ["DW011","DM019","DM020","DM023","DM024","DD002"]

  $.getJSON("./json/item.json", function (itemL) {
    $.each(itemL, function () {
      item.push(this);
      if (this.ID.substring(1,2) == "W") {        
        weapon.push(this);
      }
    });
    $.getJSON("./json/drop.json", function (dropL) {
      $.each(dropL, function () {
        drop.push(this);
      });
      $.getJSON("./json/area.json", function (areaL) {
        $.each(areaL, function () {
          area.push(this);
        });
        
        $(itemL).each(function(a, list) {
          $(Object.getOwnPropertyNames(list)).each(function(b, option){
            if(options.indexOf(option)>=0) {

            } else {
              options.push(option)
            }
          })
        })
        options.sort();
        options.splice(22,1)

        //목록 생성
        //무기
        for (i=0; i < weapon.length; i++) {
          if ($("#weaponL").val() == weapon[i].sort) {
            $("#weaponD").append("<option value=" + weapon[i].ID + " class='weaponDL'>" + weapon[i].name + "</option>")
          }
        }
        $("#weaponD .weaponDL:first-child").attr("selected","selected");
        
        $("#weaponL").on("change", function () {
          $(".weaponDL").remove();
          for (i = 0; i < weapon.length; i++) {
            if ($("#weaponL").val() == weapon[i].sort) {
              $("#weaponD").append("<option value=" + weapon[i].ID + " class='weaponDL'>" + weapon[i].name + "</option>")
            }
          }
          $("#weaponD .weaponDL:first-child").attr("selected","selected");
        })
        //방어구
        for (i = 0; i < item.length; i++) {
          if ($("#armorL").val() == item[i].sort) {
            $("#armorD").append("<option value=" + item[i].ID + " class='armorDL'>" + item[i].name + "</option>")
          }
        }
        $("#armorD .armorDL:first-child").attr("selected","selected");

        $("#armorL").on("change", function () {
          $(".armorDL").remove();
          for (i = 0; i < item.length; i++) {
            if ($("#armorL").val() == item[i].sort) {
              $("#armorD").append("<option value=" + item[i].ID + " class='armorDL'>" + L[i].name + "</option>")
            }
          }
          $("#armorD .armorDL:first-child").attr("selected","selected");
        })
        //옵션 목록
        for (i = 6; i < options.length; i++) {
          $("#optionL").append("<option value=" + options[i] + ">" + options[i] + "</option>")        
        }
        $("#optionL option:first-child").attr("selected","selected");
        
        $(document).on("change","#optionL", function () {
          $(".optionDL").remove();
          for (i = 0; i < item.length; i++) {
            if (Object.getOwnPropertyNames(item[i]).indexOf($("#optionL").val())>=0) {
              $("#optionD").append("<option value=" + item[i].ID + " class='optionDL'>" + item[i].name + "</option>")
            }
          }
          $("#optionD .optionDL:first-child").attr("selected","selected");
        });        
        for (i = 0; i < item.length; i++) {
          if (Object.getOwnPropertyNames(item[i]).indexOf($("#optionL").val())>=0) {
            $("#optionD").append("<option value=" + item[i].ID + " class='optionDL'>" + item[i].name + "</option>")
          }
        }
        $("#optionD .optionDL:first-child").attr("selected","selected");
        
        // 계산 코드 시작       
        // 하위재료 찾기
        function getById(id, arrays) {
          return arrays.filter(function (obj) {
            if (obj.ID == id) {
              return obj
            }
          })[0]
        }

        let materialsG = [];
        let needMG =[];
        let selectedG = [];      

        //무기, 방어구 토글, 리스트 생성
        function equipSort() {
          $(".equipSort").each(function(){
            if(this.checked) {
              $("#"+this.id+"L").removeClass("hide")
              $("#"+this.id+"D").removeClass("hide")
            } else {
              $("#"+this.id+"L").addClass("hide")
              $("#"+this.id+"D").addClass("hide")
            }
          })
        }
        //장비 선택, 추가
        function equipAdd() {
          let sortList = [{"dagger":"단검"}, {"twoHand":"양손검"}, {"axe":"도끼"}, {"dual":"쌍검"}, {"pistol":"권총"}, {"rifle":"돌격소총"}, {"sniper":"저격총"}, {"rapier":"레이피어"}, {"spear":"창"}, {"hammer":"망치"}, {"bat":"방망이"}, {"throw":"투척"}, {"shuriken":"암기"}, {"bow":"활"}, {"crossbow":"석궁"}, {"glove":"글러브"}, {"tonfa":"톤파"}, {"guitar":"기타"}, {"nunchaku":"쌍절곤"}, {"whip":"채찍"}, {"body":"옷"}, {"head":"머리"}, {"arm":"팔"}, {"leg":"다리"}, {"ice":"장신구"}]
          let sorted= $(".equipSort:checked").val();
          let selected = $("."+sorted+"DL:selected").val();
          let equipTemp = getById(selected,item);
          let sortK;
          for (i = 0; i < sortList.length; i++) {
            if (Object.getOwnPropertyNames(sortList[i]).indexOf(equipTemp.sort)>=0) {
              sortK = sortList[i][equipTemp.sort];
            }
          }
          sEquip.push(equipTemp)                  
          $("#equipBox").append(
            `<div class="tab `+equipTemp.ID+`">
              <button type="button" class="tabBtn `+equipTemp.ID+`">`+equipTemp.name+`<img src="./img/downarrow.png" alt="downArrowIcon" class="downArrowIcon"></button>    
              <input type="checkbox" class="checkDA" id="`+equipTemp.ID+`">
              <label for="`+equipTemp.ID+`" class="checkDALabel">재료 위치</label>
              <button type="button" class="delBtn `+equipTemp.ID+`">제거</button>
              <button type="button" class="routeBtn `+equipTemp.ID+`">최단 루트</button>
              <ul class="scroll hide `+equipTemp.ID+`">
                <li>종류 : `+sortK+`</li>
                <li>
                  <ul class="option"></ul>
                </li>
                <span class="needM">하위재료:</span>
                <li class="lowerM"></li>
                <span class="needM">드랍재료:</span>
                <li class="drops"></li>
              </ul>              
            </div>`
          )
          $("#equipInfo .equipNumber").text(sEquip.length)
          sEquip.sort();
        } 
        //시작 무기
        let startW = $("#defaultWL .defaultW:selected")[0].classList[1];
        $("#area .area#A000 .drops").append(
          "<span class='dropM checkedMA "+startW+"'>" + getById(startW,drop).name + "<span class='mNumber'>(x1)</span></span>"
        )
        function defaultW(){
          var dw = $("#defaultWL .defaultW:selected")[0].classList[1]
          $("#area .area#A000 .drops ."+startW).remove()
          $("#area .area#A000 .drops").append(
            "<span class='dropM "+dw+"'>" + getById(dw,drop).name + "<span class='mNumber'>(x1)</span></span>"
          )

          $(".materials .selectedAll ."+startW).removeClass('checkedMA')
          $("#area .area .drops ."+startW).removeClass('checkedMA')
          $("#equipBox .tab .drops ."+startW).removeClass('checkedMA')
          
          $(".materials .selectedAll ."+dw).addClass('checkedMA')
          $("#area .area .drops ."+dw).addClass('checkedMA')
          $("#equipBox .tab .drops ."+dw).addClass('checkedMA')
        }

        $("#defaultWL").on("focus",function() {
          startW = $("#defaultWL .defaultW:selected")[0].classList[1];
        })

        $("#defaultWL").on("change",function() {
          defaultW();        
        })

        let needDrops = [];

        //장비의 필요 드랍 재료, 드랍 위치를 판명하여 dropArea 배열에 추가
        function disassemble(equip) {
          //녹색
          //materials 초기화, 삽입
          materialsG.splice(0);
          if(equip.ID.substring(0,1)=="G") {
            materialsG.push(equip.ID)
          } else {
            materialsG.push(equip.material1, equip.material2);
          }
          //materials 항목을 드랍템으로 변환
          for (i = 0; i < materialsG.length;) {
            let test1G = getById(materialsG[i],item);
            if (materialsG[i].substring(0, 1) == "D"||materialsG[i].substring(0, 1) =="G") {
              i++;
            } else {
              materialsG.splice(i, 1);
              materialsG.push(test1G.material1, test1G.material2);              
            }
          };
          materialsG.sort();
          let testMG = [];
          testMG = testMG.concat(materialsG);
          selectedG.push({"ID":equip.ID, "name":equip.name ,"drops":testMG});
        };

        //녹색 이상의 제작템 스택 계산, 실제 제작 횟수 계산
        function matCalc() {
          //녹색
          needMG.splice(0)
          $(selectedG).each(function(number, selG) {
            $(selG.drops).each(function(number, matG) {
              if(getById(matG, needMG)) {
                getById(matG, needMG).count++
              } else {
                needMG.push({"ID": matG, "count": 1});
              }
            })
          })

          $(needMG).each(function(number, mats){
            if(getById(mats.ID, item)) {
              var realCount = Math.ceil(mats.count/getById(mats.ID, item).stack,-1)
              $(this)[0].count = realCount;
            }
          })
          
          needDrops.splice(0)
          $(needMG).each(function(a, mats) {
            if(mats.ID.substring(0,1) == "D") {
              needDrops.push(mats)
            } else {
              let matsInfo = getById(mats.ID, item);
              if (getById(matsInfo.material1, needDrops)) {                
                getById(matsInfo.material1, needDrops).count++
              } else {                
                needDrops.push({"ID": matsInfo.material1, "count": mats.count})
              };
              if (getById(matsInfo.material2, needDrops)) {
                getById(matsInfo.material2, needDrops).count++
              } else {                
                needDrops.push({"ID": matsInfo.material2, "count": mats.count})
              }
            }
          })
          needDrops.sort()
          //공통재료 뒤로빼기
          let nc =[]
          for(i=0; i<needDrops.length;) {
            if(commonD.indexOf(needDrops[i].ID)>=0) {
              nc.push(needDrops[i])
              needDrops.splice(i,1)
            } else {
              i++
            }
          }
          nc.sort();
          needDrops = needDrops.concat(nc)
        }
        
        //위치 드랍 계산
        function areaCalc() {
          //녹색          
          $(dropAreaG).each(function(a, areas){
            areas.drops = [];
          })
          let daTemp = []
          $(needDrops).each(function(a, needs){
            $(area).each(function(b, areas){
              if((areas.drop).indexOf(needs.ID)>=0) {
                daTemp.push({"ID":areas.ID, "drop":needs.ID, "count":needs.count})
              }
            })
          })
          $(daTemp).each(function(a, daTemps){
            $(dropAreaG).each(function(b,areas){
              if(daTemps.ID == areas.ID) {
                areas.drops.push({"ID":daTemps.drop, "count":daTemps.count})
              }
            })
          })
        }
        
        //선택 장비 정보 표시
        function equipInfo() {
          $(".tab .lowerM").children().remove()
          $(".tab .drops").children().remove()
          $(".tab .option").children().remove()
          $(".tab").each(function(){
            let selItem = getById(this.classList[1],item)
            let optionKey = Object.keys(selItem);
            let optionValue = Object.values(selItem);
            let mat1, mat2;
            let mats = []
            for (u = 6; u < optionKey.length; u++) {
              if(optionKey[u].includes("%")) {
                $(this).find(".option").append(
                  "<li>" + optionKey[u] + " : " + Math.round(optionValue[u]*100) + "%</li>"
                )
              } else {
                $(this).find(".option").append(
                  "<li>" + optionKey[u] + " : " + optionValue[u] + "</li>"
                )
              }            
            }  
            if(selItem.material1.substring(0,1)=="D") {
              mat1 = getById(selItem.material1, drop)
            } else {
              mat1 = getById(selItem.material1, item)
            }
            if(selItem.material2.substring(0,1)=="D") {
              mat2 = getById(selItem.material2, drop)
            } else {
              mat2 = getById(selItem.material2, item)
            }
            $(this).find(".lowerM").append(
              "<span class='grade"+mat1.ID.substring(0,1)+"'>[" + mat1.name + "]</span>"
            )
            $(this).find(".lowerM").append(
              "<span class='grade"+mat2.ID.substring(0,1)+"'>[" + mat2.name + "]</span>"
            )
            mats.push(mat1.ID, mat2.ID)
            for (i = 0; i < mats.length;) {
              if (mats[i].substring(0, 1) == "D") {
                i++;
              } else {
                mats.push(getById(mats[i],item).material1, getById(mats[i],item).material2);              
                mats.splice(i, 1);
              }
            };
            mats.sort();
            for(o=0; o<mats.length; o++) {
              $(this).find(".drops").append(
                "<span class='gradeD "+getById(mats[o],drop).ID+"'>[" + getById(mats[o],drop).name + "]</span>"
              )
            }
            getById(selItem.ID, selectedG).drops = mats;
          })
        }

        $(document).on("click", ".tabBtn.description", function() {
          $("#equipBox").toggleClass("hide")
        })

        $(document).on("click", ".tab .tabBtn", function() {
          $(this).siblings(".scroll").toggleClass("hide")
        })
        
        //선택 장비 드랍위치 표시
        function areaDrops() {
          $(".materials .selectedAll").children().remove();
          $("#area .area .drops").children().remove();
          $("#area .area strong").text("");
          for (i = 0; i < needDrops.length; i++) {
            $(".materials .selectedAll").append(
              "<span class='dropM "+needDrops[i].ID+"'>" + getById(needDrops[i].ID,drop).name + "<span class='mNumber'>(x"+needDrops[i].count+")</span></span>"
            )
            if(commonD.indexOf(needDrops[i].ID)>=0){
              $("#area .area#A000 .drops").append(
                "<span class='dropM "+needDrops[i].ID+"'>" + getById(needDrops[i].ID,drop).name + "<span class='mNumber'>(x"+needDrops[i].count+")</span></span>"
              )
            }
          }          
          $(dropAreaG).each(function(a, area) {
            $(area.drops).each(function(b, areaDrops){
              if(commonD.indexOf(areaDrops.ID)<0) {
                $("#area .area#"+area.ID+" .drops").append("<li class='dropM "+areaDrops.ID+"'>"+getById(areaDrops.ID, drop).name+"<span class='mNumber'>(x"+areaDrops.count+")</span></li>")
              }         
            })            
          })
          $("#area .area .drops").each(function(i,t) {
            $(t).siblings(".aLabel").children("strong").text(" ("+$(t).children().length+"가지)")
          })
        }
                
        //장비 체크박스 클릭시
        $(document).on("change",".checkDA", function() {
          $(".materials .selectedAll").children().removeClass('checkedME')
          $("#area .area .drops").children().removeClass('checkedME')
          $("#equipBox .tab .drops").children().removeClass('checkedME')
          let checkedE = [];
          $(".checkDA:checked").each(function() {
            let checked = getById($(this).attr("id"), selectedG)
            checkedE.push({"ID":checked.ID,"drops":checked.drops});
          })
          for(i=0; i<checkedE.length; i++) {
            for(o=0; o<checkedE[i].drops.length; o++){
              $(".materials .selectedAll ."+checkedE[i].drops[o]).addClass('checkedME')
              $("#area .area .drops ."+checkedE[i].drops[o]).addClass('checkedME')
              $("#equipBox .tab .drops ."+checkedE[i].drops[o]).addClass('checkedME')
            }
          }
        })
        
        //위치 체크박스 클릭시
        $(document).on("change",".checkboxA", function() {
          $(".materials .selectedAll").children().removeClass('checkedMA');
          $("#area .area .drops").children().removeClass("checkedMA");      
          $("#area .area").children(".flag").remove();    
          $("#equipBox .tab .drops").children().removeClass('checkedMA')
          let checkedA = [];
          $(".checkboxA:checked").each(function() {
            checkedA.push($(this).parents('.area').attr("id"))
          })
          let checkedAM = [];
          for(i=0; i<dropAreaG.length; i++) {
            for(o=0; o<checkedA.length; o++) {
              if(dropAreaG[i].ID == checkedA[o]){
                $(dropAreaG[i].drops).each(function() {
                  checkedAM.push(this.ID)
                })                
              }
            }            
          }
          checkedAM = Array.from(new Set(checkedAM))
          for(u=0; u<checkedAM.length; u++) {
            $(".materials .selectedAll ."+checkedAM[u]).addClass('checkedMA')
            $("#area .area .drops ."+checkedAM[u]).addClass('checkedMA')
            $("#equipBox .tab .drops ."+checkedAM[u]).addClass('checkedMA')
          }
          if($(this).siblings(".aLabel").hasClass("active")) {
            let deleteR = $(this).parents('.area').attr("id");
            checkedAOrder.splice(checkedAOrder.indexOf(deleteR),1)
          } else {
            checkedAOrder.push($(this).parents('.area').attr("id"))
          }
          $(".area label").removeClass();
          $(".area label").addClass("aLabel");
          for(i=0; i<checkedAOrder.length; i++) {
            $("#area #"+checkedAOrder[i]).prepend("<div class='flag route"+(i+1)+"'>"+(i+1)+"</div>");
            $("#area #"+checkedAOrder[i]+" .aLabel").addClass("active route"+(i+1));
          }
          defaultW()
        })

        $(".dwBtn").on("click",function(){
          $(".defaultWWrap").toggleClass("hide")
          $(".dwBtn").toggleClass("clicked")
        })

        $(".mapBtn").on("click", function() {
          $("#mapWrap").removeClass("hide");
        })
        $("#mapWrap .closeBtn").on("click", function() {
          $("#mapWrap").addClass("hide")
        })

        $(".summaryBtn").on("click", function() {
          $("#equipWrap").children().remove();
          $("#routeWrap").children().remove();
          $("#summaryWrap").toggleClass("hide");
          $("#equipBox .name").each(function() {
            $("#equipWrap").append("<li class='"+$(this).children("p").attr("class")+"'>"+$(this).children("p").text()+"</li");
          })
          for(i=0; i<checkedAOrder.length; i++) {
            $("#routeWrap").append("<li class='route"+(i+1)+"'>"+(i+1)+" : "+getById(checkedAOrder[i],area).name+"</li>")
          }
        })

        $("#summaryWrap .closeBtn").on("click", function() {
          $("#summaryWrap").addClass("hide")
        })

        equipSort();
        $(".equipSort").on("change", equipSort)
        
        //장비 추가
        $(".addBtn").on("click",function() {
          let sorted= $(".equipSort:checked").val();
          let selected = $("."+sorted+"DL:selected").val();   
          if($(".tab."+selected).length>0) {
            
          } else {
            equipAdd();
            disassemble(sEquip[sEquip.length-1])
            matCalc()
            areaCalc()
            areaDrops()
            equipInfo();
            defaultW()
            $(".active").removeClass();
            $("#area .area").children(".flag").remove();      
          }
        })
           
        //장비 제거
        $(document).on("click",".delBtn", function() {
          for(i=0; i<sEquip.length; i++) {
            if(sEquip[i].ID == this.classList[1]) {
              sEquip.splice(i,1);
            }
          }
          for(i=0; i<needMG.length; i++) {
            if(needMG[i].ID == this.classList[1]) {
              needMG.splice(i,1);
            }
          }for(i=0; i<selectedG.length; i++) {
            if(selectedG[i].ID == this.classList[1]) {
              selectedG.splice(i,1);
            }
          }
          $(this).parent().remove()
          matCalc()
          areaCalc()
          areaDrops()
          defaultW()
          $("#equipInfo .equipNumber").text(sEquip.length)
          sEquip.sort();
          $(".active").removeClass();
          $("#area .area").children(".flag").remove();       
        })  
        
      });//json
    });
  });
});//docu ready
