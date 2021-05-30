$(document).ready(function () {
  let drop = [];
  let item = [];
  let area = [];
  let options = []
  let weapon = [];
  let checkedAOrder = [];
  let sEquip = [];  
  let i,e,o,u;
  let commonD = ["DD002"]
  let bag = [];
  let checkedA = [];
  let checkedAM = [];

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
          if(this.ID == "A000") {
            commonD = commonD.concat(this.drop)
          }
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
            $("#weaponD").append(`<option value=${weapon[i].ID} class='weaponDL grade${weapon[i].ID.substring(0,1)}'> ${weapon[i].name} </option>`)
          }
        }
        $("#weaponD .weaponDL:first-child").attr("selected","selected");
        
        $("#weaponL").on("change", function () {
          $(".weaponDL").remove();
          for (i = 0; i < weapon.length; i++) {
            if ($("#weaponL").val() == weapon[i].sort) {
              $("#weaponD").append(`<option value=${weapon[i].ID} class='weaponDL grade${weapon[i].ID.substring(0,1)}'> ${weapon[i].name} </option>`)
            }
          }
          $("#weaponD .weaponDL:first-child").attr("selected","selected");
        })
        //방어구
        for (i = 0; i < item.length; i++) {
          if ($("#armorL").val() == item[i].sort) {
            $("#armorD").append(`<option value=${item[i].ID} class='armorDL grade${item[i].ID.substring(0,1)}'> ${item[i].name} </option>`)
          }
        }
        $("#armorD .armorDL:first-child").attr("selected","selected");

        $("#armorL").on("change", function () {
          $(".armorDL").remove();
          for (i = 0; i < item.length; i++) {
            if ($("#armorL").val() == item[i].sort) {
              $("#armorD").append(`<option value=${item[i].ID} class='armorDL grade${item[i].ID.substring(0,1)}'> ${item[i].name} </option>`)
            }
          }
          $("#armorD .armorDL:first-child").attr("selected","selected");
        })
        //옵션 목록
        for (i = 6; i < options.length; i++) {
          $("#optionL").append("<option value=" + options[i] + ">" + options[i] + "</option>")        
          $("#optionL").append(`<option value=${options[i]}>" ${options[i]} </option>`)  
        }
        $("#optionL option:first-child").attr("selected","selected");
        
        $(document).on("change","#optionL", function () {
          $(".optionDL").remove();
          for (i = 0; i < item.length; i++) {
            if (Object.getOwnPropertyNames(item[i]).indexOf($("#optionL").val())>=0) {
              $("#optionD").append(`<option value=${item[i].ID} class='optionDL grade${item[i].ID.substring(0,1)}'> ${item[i].name} </option>`)
            }
          }
          $("#optionD .optionDL:first-child").attr("selected","selected");
        });        
        for (i = 0; i < item.length; i++) {
          if (Object.getOwnPropertyNames(item[i]).indexOf($("#optionL").val())>=0) {
            $("#optionD").append(`<option value=${item[i].ID} class='optionDL grade${item[i].ID.substring(0,1)}'> ${item[i].name} </option>`)
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

        //총 선택 장비
        let selectedG = [];        
        //총 선택 장비의 재료(녹색+드랍)
        let needMG =[];
        //총 선택 장비의 재료(드랍)
        let needDrops = [];
        let dropAreaG = [
          {"ID":"A002", "drops":[]}, {"ID":"A003", "drops":[]}, {"ID":"A004", "drops":[]}, {"ID":"A005", "drops":[]}, {"ID":"A006", "drops":[]}, {"ID":"A007", "drops":[]}, {"ID":"A008", "drops":[]}, {"ID":"A009", "drops":[]}, {"ID":"A010", "drops":[]}, {"ID":"A011", "drops":[]}, {"ID":"A012", "drops":[]}, {"ID":"A013", "drops":[]}, {"ID":"A014", "drops":[]}, {"ID":"A015", "drops":[]}, {"ID":"A016", "drops":[]}
        ];
        //맵(이동정보)
        const areaPath = [
          //골목길# 002 : 0
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          //번화가# 003 : 1
          [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          //절# 004 : 2
          [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          //연못 005 : 3
          [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          //병원# 006 : 4
          [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          //묘지 007 : 5
          [0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
          //공장# 008 : 6
          [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
          //성당# 009 : 7
          [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
          //항구 010 : 8
          [0, 0, 0, 0, 0, 0, 1, 1, 0, 2, 0, 0, 0, 0, 0],
          //고주가# 011 : 9
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
          //숲 012 : 10
          [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0],
          //모사 013 : 11
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0],
          //호텔# 014 : 12
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
          //학교 015 : 13
          [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
          //양궁장 016 : 14
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0]
        ]

        //파라미터 = 아이템 아이디
        function itemRoute(itemId, route){
          $(`.tab.${itemId} .routeBox`).toggleClass("hide")
          //계산 여부 확인
          if($(`.tab.${itemId} .routeBox .shortRoute`).length>0) {
            return
          }
          let needs = [];
          let routeArr = []
          let routeStack = JSON.parse(JSON.stringify(route))
          let startPoint = []
          let pathT = JSON.parse(JSON.stringify(areaPath))
          let mapT = JSON.parse(JSON.stringify(area))
          if (itemId == "total") {
            for(let i=0; i<needDrops.length; i++) {
              if(needDrops[i].ID == startW && needDrops[i].count == 1) {

              } else {
                needs.push(needDrops[i].ID)
              }
            }
          } else {
            let equipMat = JSON.parse(JSON.stringify(getById(itemId, selectedG).drops))
            if(equipMat.indexOf(startW)>=0) {
              equipMat.splice(equipMat.indexOf(startW),1)
            }
            needs = needs.concat(equipMat)
          }
          needs = needs.reduce(function(acc,cur){
            if(acc.indexOf(cur)<0) {
              acc.push(cur)
            }
            return acc
          },[])
          
          $(needs).each(function(a,n){
            if(bag.indexOf(n)>=0) {
              needs.splice(needs.indexOf(n),1)
            }
          })
          mapT = calcP(mapT, needs)
          
          if(routeStack.length>0) {
            for(let i = 0; i<routeStack.length; i++) {
              let routeTemp = getById(routeStack[i], mapT).drop
              needs = needs.filter(function(x){
                if(routeTemp.includes(x)) {
                  return false
                } else {
                  return true
                }
              })
            }
            mapT = calcP(mapT, needs)
            for(let o=2; o<mapT.length; o++) {                  
              if(mapT[o].pt>0 && pathT[Number(routeStack[routeStack.length-1].substring(1,))-2][o-2]>0) {
                startPoint.push(mapT[o])                    
              } 
            }
          } else {
            $(mapT).each(function(){
              if(this.pt>0) {
                startPoint.push(this)
              }
            })
          }
          
          startPoint.sort(function(a,b) {
            return b.pt - a.pt
          })
          //야구공, 보급형기타 없이 상위템 만들기 불가능(드랍이 안댐)
          if(needs.indexOf("DW027")>=0||needs.indexOf("DW014")>=0) {
            alert("시작 무기를 확인해주세요")
            return
          }

          //지역 드랍테이블, 남은 드랍 갯수를 포인트로 변환
          function calcP(areaTemp, needTemp) {
            $(areaTemp).each(function(a, at){ 
              for(let i = 0; i<at.drop.length;) {
                if(needTemp.indexOf(at.drop[i])<0) {
                  at.drop.splice(i,1)
                } else {
                  i++
                }
              }        
              at.pt = at.drop.length
            })
            return areaTemp
          }  

          let shortest = 10;
          function shortRoute(needs, bag, path, map, idx, route){  
            console.log(needs)    
            //출발지
            let startT = JSON.parse(JSON.stringify(idx))
            if (route.length > shortest) {
              //긴 경로 제외
            } else {
              //출발지 별 도착지 탐색
              for(let i=0; i<startT.length; i++) {       
                let needsT = JSON.parse(JSON.stringify(needs))
                let bagT = JSON.parse(JSON.stringify(bag))
                let mapT = JSON.parse(JSON.stringify(map))
                let pathT = JSON.parse(JSON.stringify(path))
                //출발지의 드랍템 처리
                $(getById(startT[i].ID, mapT).drop).each(function(a, drop){
                  bagT.push(drop);
                  if(needsT.indexOf(drop)>=0) {
                    needsT.splice(needsT.indexOf(drop),1)
                  }
                })  
                mapT = calcP(mapT, needsT)
                for(let e=0; e<pathT.length; e++) {
                  pathT[e][Number(startT[i].ID.substring(1,)-2)]=0
                }
                //도착지 후보 선정(드랍템 유무, 이동가능 유무)
                let nextIdxs = []
                for(let o=2; o<mapT.length; o++) {                  
                  if(mapT[o].pt>0 && pathT[Number(startT[i].ID.substring(1,))-2][o-2]>0) {
                    nextIdxs.push(mapT[o])                    
                  } 
                }
                nextIdxs.sort(function(a,b) {
                  return b.pt - a.pt
                })
                //출발지를 루트에 추가, 재귀함수 호출
                //이동경로
                let routeT = JSON.parse(JSON.stringify(route))
                if(needsT.length<1) {
                  routeT.push(startT[i].ID);
                  if(shortest >= routeT.length) {
                    shortest = routeT.length
                    let setRoute = []
                    $(routeT).each(function(){
                      setRoute.push(getById(this, area).name)
                    })
                    routeArr.push(setRoute)
                  }
                } else if(needsT.length>0 && nextIdxs.length>0) {
                  routeT.push(startT[i].ID);              
                  if(routeT.length >= shortest) {
                    continue
                  } else {
                    shortRoute(needsT, bagT, pathT, mapT, nextIdxs, routeT);
                  }
                } else {
                  //탐색 불가
                }
              }              
            } 
            
          }//shortRoute

          shortRoute(needs, bag, pathT, mapT, startPoint, routeStack)

          routeArr = routeArr.filter(function (e) {
            return e.length <= shortest;
          });
          
          return routeArr
          
        }//
            
        //무기, 방어구 토글, 리스트 생성
        function equipSort() {
          $(".equipSort").each(function(){
            if(this.checked) {
              $(`#${this.id}L`).removeClass("hide")
              $(`#${this.id}D`).removeClass("hide")
            } else {
              $(`#${this.id}L`).addClass("hide")
              $(`#${this.id}D`).addClass("hide")
            }
          })
        }
        //장비 선택, 추가
        function equipAdd() {
          let sortList = [{"dagger":"단검"}, {"twoHand":"양손검"}, {"axe":"도끼"}, {"dual":"쌍검"}, {"pistol":"권총"}, {"rifle":"돌격소총"}, {"sniper":"저격총"}, {"rapier":"레이피어"}, {"spear":"창"}, {"hammer":"망치"}, {"bat":"방망이"}, {"throw":"투척"}, {"shuriken":"암기"}, {"bow":"활"}, {"crossbow":"석궁"}, {"glove":"글러브"}, {"tonfa":"톤파"}, {"guitar":"기타"}, {"nunchaku":"쌍절곤"}, {"whip":"채찍"}, {"body":"옷"}, {"head":"머리"}, {"arm":"팔"}, {"leg":"다리"}, {"ice":"장신구"}]
          let sorted= $(".equipSort:checked").val();
          let selected = $(`.${sorted}DL:selected`).val();
          let equipTemp = getById(selected,item);
          let sortK;
          for (i = 0; i < sortList.length; i++) {
            if (Object.getOwnPropertyNames(sortList[i]).indexOf(equipTemp.sort)>=0) {
              sortK = sortList[i][equipTemp.sort];
            }
          }
          sEquip.push(equipTemp)                  
          $("#equipBox").append(
            `<div class="tab ${equipTemp.ID} clearfix">
              <div class="tabBtnBox grade${equipTemp.ID.substring(0,1)}">
                <button type="button" class="tabBtn ${equipTemp.ID}">${equipTemp.name}<img src="./img/downarrow.png" alt="downArrowIcon" class="downArrowIcon"></button>    
                <input type="checkbox" class="checkDA" id="${equipTemp.ID}">
                <label for="${equipTemp.ID}" class="checkDALabel">재료</label>
                <button type="button" class="delBtn ${equipTemp.ID}">제거</button>
                <button type="button" class="routeBtn ${equipTemp.ID}">부위 최단</button>                
              </div>
              <div class="scrollBox hide">
                <ul class="scroll ${equipTemp.ID} clearfix">
                <li>종류 : ${sortK}</li>
                <li>
                  <ul class="option"></ul>
                </li>
                <span class="needM">하위재료 : </span>
                <li class="lowerM clearfix"></li>
                <span class="needM">드랍재료 : </span>
                <li class="drops clearfix"></li>                
                </ul> 
                <div class="routeBox hide">
                  <button type="button" class="refreshBtn ${equipTemp.ID}"><img src="./img/refresh.png" alt="refreshIcon" class="refreshIcon"/> 루트 지정 시 새로고침</button></br>
                  <ul class="routeList"></ul>
                </div>  
              </div>                                       
            </div>`
          )
          $("#equipInfo .equipNumber").text(sEquip.length)
          sEquip.sort();
        } 
        //시작 무기
        let startW = $("#defaultWL .defaultW:selected")[0].classList[1];
        $("#area .area#A000 .drops").append(
          `<span class='dropM checkedMA startW ${startW}'> ${getById(startW,drop).name} <span class='mNumber'>(x1)</span></span>`
        )
        bag = bag.concat(commonD)
        bag.push(startW)

        function defaultW(){
          var dw = $("#defaultWL .defaultW:selected")[0].classList[1]
          $("#area .area#A000 .drops .startW").remove()
          $("#area .area#A000 .drops").append(
            `<span class='dropM startW ${dw}'> ${getById(dw,drop).name} <span class='mNumber'>(x1)</span></span>`
          )
          $(`.materials .selectedAll .${startW}`).removeClass('checkedMA')
          $(`#area .area .drops .${startW}`).removeClass('checkedMA')
          $(`#equipBox .tab .drops .${startW}`).removeClass('checkedMA')
          if($(`.materials .selectedAll .${dw} .mNumber`).text().substring(2,3)<2) {
            $(`.materials .selectedAll .${dw}`).addClass('checkedMA')
          }
          if($(`#area .area .drops .${dw} .mNumber`).text().substring(2,3)<2) {
            $(`#area .area .drops .${dw}`).addClass('checkedMA')
          }
          $(`#equipBox .tab .drops .${dw}`).addClass('checkedMA')
          bag.splice(bag.indexOf(startW),1)
          bag.push(dw)
          startW = dw
        }

        $("#defaultWL").on("focus",function() {
          startW = $("#defaultWL .defaultW:selected")[0].classList[1];
        })

        $("#defaultWL").on("change",function() {
          defaultW();        
        })

        //장비의 필요 드랍 재료, 드랍 위치를 판명하여 dropArea 배열에 추가
        function disassemble(equip) {
          //녹색
          //materials 초기화, 삽입
          let materialsG = [];
          materialsG.push(equip.ID)
          
          //materials 항목을 드랍템으로 변환
          for (i = 0; i < materialsG.length;) {
            let test1G = getById(materialsG[i],item);
            if (materialsG[i].substring(0, 1) == "G"||materialsG[i].substring(0, 1) =="D") {
              i++;
            } else {
              materialsG.splice(i, 1);
              materialsG.push(test1G.material1, test1G.material2);              
            }
          };
          materialsG.sort();
          return {"ID":equip.ID, "name":equip.name ,"dropsG":materialsG}
        };

        //녹색 이상의 제작템 스택 계산, 실제 제작 횟수 계산
        function matCalc() {
          needMG.splice(0, )
          $(selectedG).each(function(number, selG) {
            $(selG.dropsG).each(function(number, matG) {
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
          for(let i = 0; i<needMG.length;) {
            if(needMG[i].ID.substring(0,1) == "D") {
              if (getById(needMG[i].ID, needDrops)) {                
                getById(needMG[i].ID, needDrops).count++
              } else {                
                needDrops.push(needMG[i])
              };         
              i++     
            } else {         
              let matsInfo = getById(needMG[i].ID, item); 
              if (getById(matsInfo.material1, needDrops)) {                
                getById(matsInfo.material1, needDrops).count++
              } else {                
                needMG.push({"ID": matsInfo.material1, "count": needMG[i].count})
              };
              if (getById(matsInfo.material2, needDrops)) {
                getById(matsInfo.material2, needDrops).count++
              } else {                
                needMG.push({"ID": matsInfo.material2, "count": needMG[i].count})
              }
              needMG.splice(i,1)
            }
          }
          needDrops.sort()
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
                  `<li>${optionKey[u]} : ${Math.round(optionValue[u]*100)}%</li>`
                )
              } else {
                $(this).find(".option").append(
                  `<li>${optionKey[u]} : ${optionValue[u]}</li>`
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
              `<span class='grade${mat1.ID.substring(0,1)}'>[ ${mat1.name} ]</span>`
            )
            $(this).find(".lowerM").append(
              `<span class='grade${mat1.ID.substring(0,1)}'>[ ${mat2.name} ]</span>`
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
                `<span class='gradeD ${getById(mats[o],drop).ID}'>[ ${getById(mats[o],drop).name} ]</span>`
              )
            }
            getById(selItem.ID, selectedG).drops = mats;
          })
        }

        $(document).on("click", ".tabBtn.description", function() {
          $("#equipBox").toggleClass("hide")
        })

        $(document).on("click", ".tab .tabBtn", function() {
          $(this).parents(".tab").find(".scrollBox").toggleClass("hide")
        })
        
        //선택 장비 드랍위치 표시
        function areaDrops() {
          $(".materials .selectedAll").children().remove();
          $("#area .area .drops").children().remove();
          $("#area .area strong").text("");
          for (i = 0; i < needDrops.length; i++) {
            $(".materials .selectedAll").append(
              `<span class='dropM ${needDrops[i].ID}'> ${getById(needDrops[i].ID,drop).name} <span class='mNumber'>(x${needDrops[i].count})</span></span>`
            )
            if(commonD.indexOf(needDrops[i].ID)>=0){
              $("#area .area#A000 .drops").append(
                `<span class='dropM ${needDrops[i].ID}'> ${getById(needDrops[i].ID,drop).name} <span class='mNumber'>(x${needDrops[i].count})</span></span>`
              )
            }
          }          
          $(dropAreaG).each(function(a, area) {
            $(area.drops).each(function(b, areaDrops){
              if(commonD.indexOf(areaDrops.ID)<0) {
                $(`#area .area#${area.ID} .drops`).append(`<li class='dropM ${areaDrops.ID}'>${getById(areaDrops.ID, drop).name}<span class='mNumber'>(x${areaDrops.count})</span></li>`)
              }         
            })            
          })
          $("#area .area .drops").each(function(i,t) {
            $(t).siblings(".aLabel").children("strong").text(`(${$(t).children().length})`)
          })
        }

        //장비 체크박스 클릭시
        $(document).on("change",".checkDA", function(e) {
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
        function areaClick(clickA){
          checkedA.splice(0,)
          checkedAM.splice(0,)
          $(".materials .selectedAll").children().removeClass('checkedMA');
          $("#area .area .drops").children().removeClass("checkedMA");      
          $("#area .area").children(".flag").remove();    
          $("#equipBox .tab .drops").children().removeClass('checkedMA')          
          $(".checkboxA:checked").each(function() {
            checkedA.push($(this).attr("id").substring(2,))
          })
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
                    
          $(".area label").removeClass();
          $(".area label").addClass("aLabel");
          for(i=0; i<checkedAOrder.length; i++) {
            $("#area #"+checkedAOrder[i]).prepend(`<div class='flag route${(i+1)}'>${(i+1)}</div>`);
            $("#area #"+checkedAOrder[i]+" .alabel").addClass("active route"+(i+1));
          }
        }

        $(".checkboxA").on("change", function(clickA){
          let nowA = clickA.target.id.substring(2,);
          if($(`#area #${nowA} .aLabel`).hasClass("active")) {            
            checkedAOrder.splice(checkedAOrder.indexOf(nowA),1)
          } else {
            checkedAOrder.push(nowA)
          }
          areaClick(nowA)
          defaultW()
        })

        $(".dwBtn").on("click",function(){
          $(".defaultWWrap").toggleClass("hide")
          $(".dwBtn").toggleClass("clicked")
        })

        $(".summaryBtn").on("click", function() {
          $("#equipWrap").children().remove();
          $("#routeWrap").children().remove();
          $("#summaryWrap").toggleClass("hide");
          $("#equipBox .tabBtn").each(function() {
            $("#equipWrap").append(`<li class='grade${this.classList[1].substring(0,1)}'>${$(this).text()}</li>`);
          })
          for(i=0; i<checkedAOrder.length; i++) {
            $("#routeWrap").append(`<li class='route${(i+1)}'>${(i+1)} : ${getById(checkedAOrder[i],area).name}</li>`)
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
          let selected = $(`.${sorted}DL:selected`).val();   
          let nowA = checkedA[checkedA.length -1]
          if($(".tab."+selected).length>0) {
            
          } else {
            equipAdd();
            selectedG.push(disassemble(sEquip[sEquip.length-1]))
            matCalc()
            areaCalc()
            areaDrops()
            equipInfo();
            areaClick(nowA)
            defaultW();  
          }
        })
           
        //장비 제거
        $(document).on("click",".delBtn", function() {
          let nowA = checkedA[checkedA.length -1]
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
          $(this).parents(".tab").remove()
          matCalc()
          areaCalc()
          areaDrops()
          areaClick(nowA)
          defaultW();  
          $("#equipInfo .equipNumber").text(sEquip.length)
          sEquip.sort();    
        })  

        //최단경로
        $(document).on("click",".routeBtn", function() {
          $(this).toggleClass("clicked")
          let itemId = this.classList[1]
          let routeArr = itemRoute(itemId, checkedAOrder)
          $(routeArr).each(function(){
            $(`#equipBox .${itemId}.tab .routeBox .routeList`).append(`<li class='shortRoute'>${this.join(" -> ")}</li>`)
          })
        })  

        $(document).on("click",".refreshBtn", function() {
          let itemId = this.classList[1]
          $(this).siblings(".routeList").children().remove();
          $(`.tab.${itemId} .routeBox`).toggleClass("hide")
          let routeArr = itemRoute(itemId, checkedAOrder)
          $(routeArr).each(function(){
            $(`#equipBox .${itemId}.tab .routeBox .routeList`).append(`<li class='shortRoute'>${this.join(" -> ")}</li>"`)
          })
        })          

        $(".totalRouteBtn").on("click", function() {
          $("#totalRouteWrap").removeClass("hide");          
        })

        $("#totalRouteWrap .totalRouteCalcBtn").on("click", function() {
          $("#totalRouteWrap").children(".shortRoute").remove();
          let routeArr = itemRoute("total", checkedAOrder)
          $(routeArr).each(function(){
            $("#totalRouteWrap").append(`<li class='shortRoute'><span>${this.join(" -> ")}</span></li>`)
          })
        })

        $("#totalRouteWrap .closeBtn").on("click", function() {
          $("#totalRouteWrap").addClass("hide")
        })  
      });//json
    });
  });
});//docu ready
