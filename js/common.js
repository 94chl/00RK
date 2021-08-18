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
            if(options.indexOf(option)<0&&!["ID", "name", "limit", "material", "pickup", "sort", "stack", "장탄수"].includes(option)) {
              options.push(option)
            }
          })
        })
        options.sort()

        //목록 생성
        //무기
        for (i = 0; i < weapon.length; i++) {
          if ($("#weaponL").val() == weapon[i].sort) {
            $("#weaponD").append(
              `<option value=${weapon[i].ID} class='weaponDL grade${weapon[
                i
              ].ID.substring(0, 1)}'> ${weapon[i].name} </option>`
            );
          }
        }
        $("#weaponD .weaponDL:first-child").attr("selected", "selected");

        $("#weaponL").on("change", function () {
          $(".weaponDL").remove();
          for (i = 0; i < weapon.length; i++) {
            if ($("#weaponL").val() == weapon[i].sort) {
              $("#weaponD").append(
                `<option value=${weapon[i].ID} class='weaponDL grade${weapon[
                  i
                ].ID.substring(0, 1)}'> ${weapon[i].name} </option>`
              );
            }
          }
          $("#weaponD .weaponDL:first-child").attr("selected", "selected");
        });

        //방어구
        for (i = 0; i < item.length; i++) {
          if ($("#armorL").val() == item[i].sort) {
            $("#armorD").append(
              `<option value=${item[i].ID} class='armorDL grade${item[
                i
              ].ID.substring(0, 1)}'> ${item[i].name} </option>`
            );
          }
        }
        $("#armorD .armorDL:first-child").attr("selected", "selected");

        $("#armorL").on("change", function () {
          $(".armorDL").remove();
          for (i = 0; i < item.length; i++) {
            if ($("#armorL").val() == item[i].sort) {
              $("#armorD").append(
                `<option value=${item[i].ID} class='armorDL grade${item[
                  i
                ].ID.substring(0, 1)}'> ${item[i].name} </option>`
              );
            }
          }
          $("#armorD .armorDL:first-child").attr("selected", "selected");
        });

        //옵션 목록
        for (i = 0; i < options.length; i++) {
          $("#optionL").append(
            `<option value=${options[i]}>${options[i]}</option>`
          );
        }
        $("#optionL option:first-child").attr("selected", "selected");

        $(document).on("change", "#optionL", function () {
          $(".optionDL").remove();
          for (i = 0; i < item.length; i++) {
            if (
              Object.getOwnPropertyNames(item[i]).indexOf(
                $("#optionL").val()
              ) >= 0
            ) {
              $("#optionD").append(
                `<option value=${item[i].ID} class='optionDL grade${item[
                  i
                ].ID.substring(0, 1)}'> ${item[i].name} </option>`
              );
            }
          }
          $("#optionD .optionDL:first-child").attr("selected", "selected");
        });
        for (i = 0; i < item.length; i++) {
          if (
            Object.getOwnPropertyNames(item[i]).indexOf($("#optionL").val()) >=
            0
          ) {
            $("#optionD").append(
              `<option value=${item[i].ID} class='optionDL grade${item[
                i
              ].ID.substring(0, 1)}'> ${item[i].name} </option>`
            );
          }
        }
        $("#optionD .optionDL:first-child").attr("selected", "selected");

        //음식, 트랩
        for (i = 0; i < item.length; i++) {
          if ($("#foodTrapL").val() == item[i].sort) {
            $("#foodTrapD").append(
              `<option value=${item[i].ID} class='foodTrapDL grade${item[
                i
              ].ID.substring(0, 1)}'> ${item[i].name} </option>`
            );
          }
        }
        $("#foodTrapD .foodTrapDL:first-child").attr("selected", "selected");

        $("#foodTrapL").on("change", function () {
          $(".foodTrapDL").remove();
          for (i = 0; i < item.length; i++) {
            if ($("#foodTrapL").val() == item[i].sort) {
              $("#foodTrapD").append(
                `<option value=${item[i].ID} class='foodTrapDL grade${item[
                  i
                ].ID.substring(0, 1)}'> ${item[i].name} </option>`
              );
            }
          }
          $("#foodTrapD .foodTrapDL:first-child").attr("selected", "selected");
        });

        //무기, 방어구 토글, 리스트 생성
        function equipSort() {
          $(".equipSort").each(function () {
            if (this.checked) {
              $(`#${this.id}L`).removeClass("hide");
              $(`#${this.id}D`).removeClass("hide");
            } else {
              $(`#${this.id}L`).addClass("hide");
              $(`#${this.id}D`).addClass("hide");
            }
          });
        }

        equipSort();
        $(".equipSort").on("change", equipSort);

        // 계산 코드 시작
        // 하위재료 찾기
        function getById(id, arrays) {
          return arrays.filter(function (obj) {
            if (obj.ID == id) {
              return obj;
            }
          })[0];
        }

        //총 선택 장비
        let selectedG = [];
        //총 선택 장비의 재료(녹색+드랍)
        let needMG = [];
        //총 선택 장비의 재료(드랍)
        let needDrops = [];
        let dropAreaG = [
          { ID: "A002", drops: [] },
          { ID: "A003", drops: [] },
          { ID: "A004", drops: [] },
          { ID: "A005", drops: [] },
          { ID: "A006", drops: [] },
          { ID: "A007", drops: [] },
          { ID: "A008", drops: [] },
          { ID: "A009", drops: [] },
          { ID: "A010", drops: [] },
          { ID: "A011", drops: [] },
          { ID: "A012", drops: [] },
          { ID: "A013", drops: [] },
          { ID: "A014", drops: [] },
          { ID: "A015", drops: [] },
          { ID: "A016", drops: [] },
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
          [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
        ];

        //파라미터 = 아이템 아이디
        function itemRoute(itemId, route) {
          $(`.tab.${itemId} .routeBox`).toggleClass("hide");
          //계산 여부 확인
          if ($(`.tab.${itemId} .routeBox .shortRoute`).length > 0) {
            return;
          }
          let needs = [];
          let routeArr = [];
          let routeStack = JSON.parse(JSON.stringify(route));
          let startPoint = [];
          let pathT = JSON.parse(JSON.stringify(areaPath));
          let mapT = JSON.parse(JSON.stringify(area));
          if (itemId == "total") {
            for (let i = 0; i < needDrops.length; i++) {
              if (needDrops[i].ID == startW && needDrops[i].count == 1) {
              } else {
                needs.push(needDrops[i].ID);
              }
            }
          } else {
            let equipMat = JSON.parse(
              JSON.stringify(getById(itemId, selectedG).drops)
            );
            if (equipMat.indexOf(startW) >= 0) {
              equipMat.splice(equipMat.indexOf(startW), 1);
            }
            needs = needs.concat(equipMat);
          }

          needs = needs.reduce(function (acc, cur) {
            if (acc.indexOf(cur) < 0) {
              acc.push(cur);
            }
            return acc;
          }, []);

          $(needs).each(function (a, n) {
            if (bag.indexOf(n) >= 0) {
              needs.splice(needs.indexOf(n), 1);
            }
          });
          mapT = calcP(mapT, needs);

          if (routeStack.length > 0) {
            for (let i = 0; i < routeStack.length; i++) {
              let routeTemp = getById(routeStack[i], mapT).drop;
              needs = needs.filter(function (x) {
                if (routeTemp.includes(x)) {
                  return false;
                } else {
                  return true;
                }
              });
            }
            mapT = calcP(mapT, needs);
            for (let o = 2; o < mapT.length; o++) {
              if (
                mapT[o].pt > 0 &&
                pathT[
                  Number(routeStack[routeStack.length - 1].substring(1)) - 2
                ][o - 2] > 0
              ) {
                startPoint.push(mapT[o]);
              }
            }
          } else {
            $(mapT).each(function () {
              if (this.pt > 0) {
                startPoint.push(this);
              }
            });
          }

          startPoint.sort(function (a, b) {
            return b.pt - a.pt;
          });
          //렌즈, 보급형기타 없이 상위템 만들기 불가능(드랍이 안댐)
          if (needs.indexOf("DW027") >= 0 || needs.indexOf("DW028") >= 0) {
            alert("보급형 기타, 렌즈는 시작무기를 통해 추가해주세요");
            return;
          }

          //지역 드랍테이블, 남은 드랍 갯수를 포인트로 변환
          function calcP(areaTemp, needTemp) {
            $(areaTemp).each(function (a, at) {
              for (let i = 0; i < at.drop.length; ) {
                if (needTemp.indexOf(at.drop[i]) < 0) {
                  at.drop.splice(i, 1);
                } else {
                  i++;
                }
              }
              at.pt = at.drop.length;
            });
            return areaTemp;
          }

          let shortest = 10;
          function shortRoute(needs, bag, path, map, idx, route) {
            //출발지
            let startT = JSON.parse(JSON.stringify(idx));
            if (route.length > shortest) {
              //긴 경로 제외
            } else {
              //출발지 별 도착지 탐색
              for (let i = 0; i < startT.length; i++) {
                let needsT = JSON.parse(JSON.stringify(needs));
                let bagT = JSON.parse(JSON.stringify(bag));
                let mapT = JSON.parse(JSON.stringify(map));
                let pathT = JSON.parse(JSON.stringify(path));
                //출발지의 드랍템 처리
                $(getById(startT[i].ID, mapT).drop).each(function (a, drop) {
                  bagT.push(drop);
                  if (needsT.indexOf(drop) >= 0) {
                    needsT.splice(needsT.indexOf(drop), 1);
                  }
                });
                mapT = calcP(mapT, needsT);
                for (let e = 0; e < pathT.length; e++) {
                  pathT[e][Number(startT[i].ID.substring(1) - 2)] = 0;
                }
                //도착지 후보 선정(드랍템 유무, 이동가능 유무)
                let nextIdxs = [];
                for (let o = 2; o < mapT.length; o++) {
                  if (
                    mapT[o].pt > 0 &&
                    pathT[Number(startT[i].ID.substring(1)) - 2][o - 2] > 0
                  ) {
                    nextIdxs.push(mapT[o]);
                  }
                }
                nextIdxs.sort(function (a, b) {
                  return b.pt - a.pt;
                });
                //출발지를 루트에 추가, 재귀함수 호출
                //이동경로
                let routeT = JSON.parse(JSON.stringify(route));
                if (needsT.length < 1) {
                  routeT.push(startT[i].ID);
                  if (shortest >= routeT.length) {
                    shortest = routeT.length;
                    let setRoute = [];
                    $(routeT).each(function () {
                      setRoute.push(getById(this, area).name);
                    });
                    routeArr.push(setRoute);
                  }
                } else if (needsT.length > 0 && nextIdxs.length > 0) {
                  routeT.push(startT[i].ID);
                  if (routeT.length >= shortest) {
                    continue;
                  } else {
                    shortRoute(needsT, bagT, pathT, mapT, nextIdxs, routeT);
                  }
                } else {
                  //탐색 불가
                }
              }
            }
          } //shortRoute

          shortRoute(needs, bag, pathT, mapT, startPoint, routeStack);

          routeArr = routeArr.filter(function (e) {
            return e.length <= shortest;
          });

          return routeArr;
        }

        //장비 선택, 추가
        function equipAdd() {
          let sortList = [
            { dagger: "단검" },
            { twoHand: "양손검" },
            { axe: "도끼" },
            { dual: "쌍검" },
            { pistol: "권총" },
            { rifle: "돌격소총" },
            { sniper: "저격총" },
            { rapier: "레이피어" },
            { spear: "창" },
            { hammer: "망치" },
            { bat: "방망이" },
            { throw: "투척" },
            { shuriken: "암기" },
            { bow: "활" },
            { crossbow: "석궁" },
            { glove: "글러브" },
            { tonfa: "톤파" },
            { guitar: "기타" },
            { nunchaku: "쌍절곤" },
            { whip: "채찍" },
            { body: "옷" },
            { head: "머리" },
            { arm: "팔" },
            { leg: "다리" },
            { ice: "장신구" },
            { food: "음식" },
            { drink: "음료" },
            { trap: "함정" },
          ];
          let sorted = $(".equipSort:checked").val();
          let selected = $(`.${sorted}DL:selected`).val();
          let equipTemp = getById(selected, item);
          let sortK;
          for (i = 0; i < sortList.length; i++) {
            if (
              Object.getOwnPropertyNames(sortList[i]).indexOf(equipTemp.sort) >=
              0
            ) {
              sortK = sortList[i][equipTemp.sort];
            }
          }
          sEquip.push(equipTemp);
          $("#equipBox").append(
            `<div class="tab ${equipTemp.ID} clearfix">
              <div class="tabBtnBox grade${equipTemp.ID.substring(0, 1)}">
                <button type="button" class="tabBtn ${equipTemp.ID}">${
              equipTemp.name
            }<img src="./img/downarrow.png" alt="downArrowIcon" class="downArrowIcon"></button>    
                <input type="checkbox" class="checkDA" id="${equipTemp.ID}">
                <label for="${
                  equipTemp.ID
                }" class="checkDALabel"><img src="./img/check.png" alt="checkIcon" class="checkIcon"></label>
                <button type="button" class="delBtn ${
                  equipTemp.ID
                }"><img src="./img/remove.png" alt="removeIcon" class="removeIcon"></button>
                <button type="button" class="routeBtn ${
                  equipTemp.ID
                }"><img src="./img/map.png" alt="mapIcon" class="mapIcon"></button>                
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
                  <button type="button" class="refreshBtn ${
                    equipTemp.ID
                  }"><img src="./img/refresh.png" alt="refreshIcon" class="refreshIcon"/> 루트 지정 시 새로고침</button></br>
                  <ul class="routeList"></ul>
                </div>  
              </div>                                       
            </div>`
          );
          $("#equipInfo .equipNumber").text(sEquip.length);
          sEquip.sort();
        }

        bag = bag.concat(commonD);

        let startW;
        function defaultW() {
          var dw = $("#defaultWL .defaultW:selected")[0].classList[1];
          if (dw) {
            getMat(dw, bagNow.indexOf("empty"));
            if (
              $(`.materials .selectedAll .${dw} .mNumber`)
                .text()
                .substring(2, 3) < 2
            ) {
              $(`.materials .selectedAll .${dw}`).addClass("checkedMA");
            }
            if (
              $(`#area .area .drops .${dw} .mNumber`).text().substring(2, 3) < 2
            ) {
              $(`#area .area .drops .${dw}`).addClass("checkedMA");
            }
            $(`#equipBox .tab .drops .${dw}`).addClass("checkedMA");
            if (startW) {
              $(`.materials .selectedAll .${startW}`).removeClass("checkedMA");
              $(`#area .area .drops .${startW}`).removeClass("checkedMA");
              $(`#equipBox .tab .drops .${startW}`).removeClass("checkedMA");
              bag.splice(bag.indexOf(startW), 1);
            }
            bag.push(dw);
            startW = dw;
          }
        }

        $("#defaultWL").on("focus", function () {
          startW = $("#defaultWL .defaultW:selected")[0].classList[1];
        });

        $("#defaultWL").on("change", function () {
          defaultW();
        });

        //장비의 필요 드랍 재료, 드랍 위치를 판명하여 dropArea 배열에 추가
        function disassemble(equip) {
          //녹색
          //materials 초기화, 삽입
          let materialsG = [];
          materialsG.push(equip.ID);

          //materials 항목을 드랍템으로 변환
          for (i = 0; i < materialsG.length; ) {
            let test1G = getById(materialsG[i], item);
            if (
              materialsG[i].substring(0, 2) == "GM" ||
              materialsG[i].substring(0, 1) == "D"
            ) {
              i++;
            } else {
              materialsG.splice(i, 1);
              materialsG = materialsG.concat(test1G.material);
            }
          }
          materialsG.sort();
          return { ID: equip.ID, name: equip.name, dropsG: materialsG };
        }

        //녹색 이상의 제작템 스택 계산, 실제 제작 횟수 계산
        function matCalc() {
          needMG.splice(0);
          $(selectedG).each(function (number, selG) {
            $(selG.dropsG).each(function (number, matG) {
              if (getById(matG, needMG)) {
                getById(matG, needMG).count++;
              } else {
                needMG.push({ ID: matG, count: 1 });
              }
            });
          });

          $(needMG).each(function (number, mats) {
            if (getById(mats.ID, item)) {
              var realCount = Math.ceil(
                mats.count / getById(mats.ID, item).stack,
                -1
              );
              $(this)[0].count = realCount;
            }
          });

          needDrops.splice(0);
          for (let i = 0; i < needMG.length; ) {
            if (needMG[i].ID.substring(0, 1) == "D") {
              if (getById(needMG[i].ID, needDrops)) {
                getById(needMG[i].ID, needDrops).count++;
              } else {
                needDrops.push(needMG[i]);
              }
              i++;
            } else {
              let matsInfo = getById(needMG[i].ID, item);
              if (getById(matsInfo.material[0], needDrops)) {
                getById(matsInfo.material[0], needDrops).count++;
              } else {
                needMG.push({
                  ID: matsInfo.material[0],
                  count: needMG[i].count,
                });
              }
              if (getById(matsInfo.material[1], needDrops)) {
                getById(matsInfo.material[1], needDrops).count++;
              } else {
                needMG.push({
                  ID: matsInfo.material[1],
                  count: needMG[i].count,
                });
              }
              needMG.splice(i, 1);
            }
          }
          needDrops.sort();
        }

        //위치 드랍 계산
        function areaCalc() {
          //녹색
          $(dropAreaG).each(function (a, areas) {
            areas.drops = [];
          });
          let daTemp = [];
          $(needDrops).each(function (a, needs) {
            $(area).each(function (b, areas) {
              if (areas.drop.indexOf(needs.ID) >= 0) {
                daTemp.push({
                  ID: areas.ID,
                  drop: needs.ID,
                  count: needs.count,
                });
              }
            });
          });
          $(daTemp).each(function (a, daTemps) {
            $(dropAreaG).each(function (b, areas) {
              if (daTemps.ID == areas.ID) {
                areas.drops.push({ ID: daTemps.drop, count: daTemps.count });
              }
            });
          });
        }

        //선택 장비 정보 표시
        function equipInfo() {
          $(".tab .lowerM").children().remove();
          $(".tab .drops").children().remove();
          $(".tab .option").children().remove();
          $(".tab").each(function () {
            let selItem = getById(this.classList[1], item);
            let optionKey = Object.keys(selItem);
            let optionValue = Object.values(selItem);
            let mat1, mat2;
            let mats = [];
            for (u = 7; u < optionKey.length; u++) {
              if (optionKey[u].includes("%")) {
                $(this)
                  .find(".option")
                  .append(
                    `<li>${optionKey[u].substring(
                      0,
                      optionKey[u].length - 3
                    )} : ${parseInt(optionValue[u] * 100)}%</li>`
                  );
              } else {
                $(this)
                  .find(".option")
                  .append(`<li>${optionKey[u]} : ${optionValue[u]}</li>`);
              }
            }
            if (selItem.material[0].substring(0, 1) == "D") {
              mat1 = getById(selItem.material[0], drop);
            } else {
              mat1 = getById(selItem.material[0], item);
            }
            if (selItem.material[1].substring(0, 1) == "D") {
              mat2 = getById(selItem.material[1], drop);
            } else {
              mat2 = getById(selItem.material[1], item);
            }
            $(this)
              .find(".lowerM")
              .append(
                `<button class="showLower ${
                  mat1.ID
                }"><span class='grade${mat1.ID.substring(0, 1)}'>[ ${
                  mat1.name
                } ]</span></button>`
              );
            $(this)
              .find(".lowerM")
              .append(
                `<button class="showLower ${
                  mat2.ID
                }"><span class='grade${mat2.ID.substring(0, 1)}'>[ ${
                  mat2.name
                } ]</span></button>`
              );
            mats.push(mat1.ID, mat2.ID);
            for (i = 0; i < mats.length; ) {
              if (mats[i].substring(0, 1) == "D") {
                i++;
              } else {
                mats.push(
                  getById(mats[i], item).material[0],
                  getById(mats[i], item).material[1]
                );
                mats.splice(i, 1);
              }
            }
            mats.sort();
            for (o = 0; o < mats.length; o++) {
              $(this)
                .find(".drops")
                .append(
                  `<span class='gradeD ${getById(mats[o], drop).ID}'>[ ${
                    getById(mats[o], drop).name
                  } ]</span>`
                );
            }
            getById(selItem.ID, selectedG).drops = mats;
          });
        }

        function tempInfo(tempEquip) {
          const optionKey = Object.keys(tempEquip);
          let equipMaterials = [tempEquip.material[0], tempEquip.material[1]];
          let equipDrops = [tempEquip.material[0], tempEquip.material[1]];
          for (i = 0; i < equipDrops.length; ) {
            if (equipDrops[i].substring(0, 1) != "D") {
              equipDrops = equipDrops.concat(
                getById(equipDrops[i], item).material
              );
              equipDrops.splice(i, 1);
            } else {
              i++;
            }
          }
          equipDrops.sort();

          $(".equipInfoTempTab span").remove();
          $(".equipInfoTempTab").append(
            `<span class="grade${tempEquip.ID.substring(0, 1)}">${
              tempEquip.name
            }<span>`
          );

          $(".equipInfoTemp").children().remove();
          $(".equipInfoTemp").append(
            `<ul class="${tempEquip.ID}">
              <li>
                <ul class="option"></ul>
              </li>
              <span class="needM">하위재료 : </span>
              <li class="lowerM clearfix">
                <button class="showLower ${
                  equipMaterials[0]
                }"><span class="grade${equipMaterials[0].substring(0, 1)}">[ ${
              equipMaterials[0].substring(0, 1) == "D"
                ? getById(equipMaterials[0], drop).name
                : getById(equipMaterials[0], item).name
            } ]</span></button>
                <button class="showLower ${
                  equipMaterials[1]
                }"><span class="grade${equipMaterials[1].substring(0, 1)}">[ ${
              equipMaterials[1].substring(0, 1) == "D"
                ? getById(equipMaterials[1], drop).name
                : getById(equipMaterials[1], item).name
            } ]</span></button>
              </li>
              <span class="needM">드랍재료 : </span>
              <li class="drops clearfix"></li>                
            </ul>`
          );
          for (i = 0; i < equipDrops.length; i++) {
            $(`.equipInfoTemp .${tempEquip.ID} .drops`).append(
              `<span class="gradeD">[ ${
                getById(equipDrops[i], drop).name
              } ]</span>`
            );
          }
          for (i = 7; i < optionKey.length; i++) {
            if (optionKey[i].includes("%")) {
              $(`.equipInfoTemp .${tempEquip.ID} .option`).append(
                `<li><p></p> ${optionKey[i].substring(
                  0,
                  optionKey[i].length - 3
                )}: <span>${parseInt(
                  tempEquip[optionKey[i]] * 100
                )}%</span></li>`
              );
            } else {
              $(`.equipInfoTemp .${tempEquip.ID} .option`).append(
                `<li><p></p> ${optionKey[i]}: <span>${
                  tempEquip[optionKey[i]]
                }</span></li>`
              );
            }
          }
        }

        $(document).on(
          "change",
          "#weaponD, #armorD, #optionD, #foodTrapD",
          function (e) {
            const tempEquip = getById(e.target.value, item);
            tempInfo(tempEquip);
          }
        );

        $(document).on(
          "change",
          "#weaponL, #armorL, #optionL, #foodTrapL",
          function (e) {
            const tempEquip = getById(
              $(`#${e.target.id.substring(0, e.target.id.length - 1)}D`)[0]
                .value,
              item
            );
            tempInfo(tempEquip);
          }
        );

        $(document).on("click", ".showLower", function (e) {
          if (e.target.classList[1].substring(0, 1) == "D") {
            return;
          }
          const tempEquip = getById(e.target.classList[1], item);
          tempInfo(tempEquip);
        });

        $(document).on("click", ".tabBtn.description", function () {
          $("#equipBox").toggleClass("hide");
        });

        $(document).on("click", ".tab .tabBtn", function () {
          $(this).parents(".tab").find(".scrollBox").toggleClass("hide");
        });

        let showDropsAll = false;
        //선택 장비 드랍위치 표시
        function areaDrops() {
          $(".materials .selectedAll").children().remove();
          $("#area .area .drops").children().remove();
          $("#area .area strong").text("");
          for (i = 0; i < needDrops.length; i++) {
            $(".materials .selectedAll").append(
              `<span class='dropM ${needDrops[i].ID}'> ${
                getById(needDrops[i].ID, drop).name
              } <span class='mNumber'>(x${needDrops[i].count})</span></span>`
            );
          }
          if (showDropsAll) {
            $(area).each(function (a, areaInfo) {
              $(areaInfo.drop).each(function (b, areaDrops) {
                $(`#area .area#${areaInfo.ID} .drops`).append(
                  `<li class='dropM ${areaDrops}'><button class="getMatBtn">${
                    getById(areaDrops, drop).name
                  }<span class='mNumber'></span></button></li>`
                );
              });
            });
          } else {
            for (i = 0; i < needDrops.length; i++) {
              if (commonD.indexOf(needDrops[i].ID) >= 0) {
                $("#area .area#A000 .drops").append(
                  `<li class='dropM ${
                    needDrops[i].ID
                  }'><button class="getMatBtn">${
                    getById(needDrops[i].ID, drop).name
                  }<span class='mNumber'>(x${
                    needDrops[i].count
                  })</span></button></li>`
                );
              }
            }
            $(dropAreaG).each(function (a, area) {
              $(area.drops).each(function (b, areaDrops) {
                if (commonD.indexOf(areaDrops.ID) < 0) {
                  $(`#area .area#${area.ID} .drops`).append(
                    `<li class='dropM ${
                      areaDrops.ID
                    }'><button class="getMatBtn">${
                      getById(areaDrops.ID, drop).name
                    }<span class='mNumber'>(x${
                      areaDrops.count
                    })</span></button></li>`
                  );
                }
              });
            });
            $("#area .area .drops").each(function (i, t) {
              $(t)
                .siblings(".aLabel")
                .children("strong")
                .text(`(${$(t).children().length})`);
            });
          }
        }

        $(".showDropsAllBtn").on("click", function () {
          $(".showDropsAllBtn").toggleClass("clicked");
          showDropsAll ? (showDropsAll = false) : (showDropsAll = true);
          areaDrops();
        });

        //장비 체크박스 클릭시
        $(document).on("change", ".checkDA", function (e) {
          $(".materials .selectedAll").children().removeClass("checkedME");
          $("#area .area .drops .dropM").children().removeClass("checkedME");
          $("#equipBox .tab .drops").children().removeClass("checkedME");
          let checkedE = [];
          $(".checkDA:checked").each(function () {
            let checked = getById($(this).attr("id"), selectedG);
            checkedE.push({ ID: checked.ID, drops: checked.drops });
          });
          for (i = 0; i < checkedE.length; i++) {
            for (o = 0; o < checkedE[i].drops.length; o++) {
              $(".materials .selectedAll ." + checkedE[i].drops[o]).addClass(
                "checkedME"
              );
              $(
                "#area .area .drops ." + checkedE[i].drops[o] + " .getMatBtn"
              ).addClass("checkedME");
              $("#equipBox .tab .drops ." + checkedE[i].drops[o]).addClass(
                "checkedME"
              );
            }
          }
        });

        //위치 체크박스 클릭시
        function areaClick() {
          checkedA.splice(0);
          checkedAM.splice(0);
          $(".materials .selectedAll").children().removeClass("checkedMA");
          $("#area .area .drops").children().removeClass("checkedMA");
          $("#area .area").children(".flag").remove();
          $("#equipBox .tab .drops").children().removeClass("checkedMA");
          $(".checkboxA:checked").each(function () {
            checkedA.push($(this).attr("id").substring(2));
          });
          for (i = 0; i < dropAreaG.length; i++) {
            for (o = 0; o < checkedA.length; o++) {
              if (dropAreaG[i].ID == checkedA[o]) {
                $(dropAreaG[i].drops).each(function () {
                  checkedAM.push(this.ID);
                });
              }
            }
          }
          checkedAM = Array.from(new Set(checkedAM));
          for (u = 0; u < checkedAM.length; u++) {
            $(".materials .selectedAll ." + checkedAM[u]).addClass("checkedMA");
            $("#area .area .drops ." + checkedAM[u]).addClass("checkedMA");
            $("#equipBox .tab .drops ." + checkedAM[u]).addClass("checkedMA");
          }

          $(".area label").removeClass();
          $(".area label").addClass("aLabel");
          for (i = 0; i < checkedAOrder.length; i++) {
            $("#area #" + checkedAOrder[i]).prepend(
              `<div class='flag route${i + 1}'>${i + 1}</div>`
            );
            $("#area #" + checkedAOrder[i] + " .alabel").addClass(
              "active route" + (i + 1)
            );
          }
        }

        $(".checkboxA").on("change", function (clickA) {
          let nowA = clickA.target.id.substring(2);
          if ($(`#area #${nowA} .aLabel`).hasClass("active")) {
            checkedAOrder.splice(checkedAOrder.indexOf(nowA), 1);
          } else {
            checkedAOrder.push(nowA);
          }
          areaClick();
        });

        $(".dwBtn").on("click", function () {
          $(".defaultWWrap").toggleClass("hide");
          $(".dwBtn").toggleClass("clicked");
        });

        $(".summaryBtn").on("click", function () {
          $("#equipWrap").children().remove();
          $("#routeWrap").children().remove();
          $("#summaryWrap").toggleClass("hide");
          $("#equipBox .tabBtn").each(function () {
            $("#equipWrap").append(
              `<li class='grade${this.classList[1].substring(0, 1)}'>${$(
                this
              ).text()}</li>`
            );
          });
          for (i = 0; i < checkedAOrder.length; i++) {
            $("#routeWrap").append(
              `<li class='route${i + 1}'>${i + 1} : ${
                getById(checkedAOrder[i], area).name
              }</li>`
            );
          }
        });

        $("#summaryWrap .closeBtn").on("click", function () {
          $("#summaryWrap").addClass("hide");
        });

        function showStatus(btn) {
          $(".statusEquip").children().remove();
          $(".detailOpts>p").children().remove();
          $(".detailOpts").addClass("hide");
          $(".detailOpts>p").each(function () {
            if ($(this).hasClass("doubleOpts")) {
              $(this).append(
                '<span><span class="optValue">0</span> / <span class="optValue">0</span></span>'
              );
            } else if ($(this).hasClass("doubleOptsX")) {
              $(this).append(
                '<span><span class="optValue"></span><span class="optValue"></span></span>'
              );
            } else {
              $(this).append('<span><span class="optValue"></span></span>');
            }
          });
          let totalOpts = {};
          const exception = [
            "[고유]강인함",
            "[고유]불꽃결계",
            "[고유]의념",
            "치유감소(기공)",
            "치유감소(스킬)",
          ];
          const hp = ["체력", "레벨당체력", "체력재생", "체력재생(%)"];
          const mp = ["스태미너", "스태미너재생", "스태미너재생(%)"];
          const atk = [
            "공격력",
            "레벨당공격력",
            "크리율(%)",
            "크리뎀(%)",
            "방어력관통(%)",
          ];
          const def = [
            "방어력",
            "레벨당방어력",
            "기공뎀감소",
            "스킬뎀감소(고정)",
            "스킬뎀감소(%)",
            "크리뎀감소(%)",
            "트랩피해감소(%)",
          ];
          const autoAtk = ["기공추", "레벨당기공추"];
          const skillAtk = [
            "스킬증폭(고정)",
            "스킬증폭(%)",
            "레벨당스킬증폭(고정)",
            "레벨당스킬증폭(%)",
          ];
          const spd = [
            "공격속도(%)",
            "레벨당공격속도(%)",
            "이동속도",
            "비전투이속",
          ];
          const unique = ["[고유]강인함", "[고유]불꽃결계", "[고유]의념"];
          const etc = [
            "피흡(%)",
            "치유감소(기공)",
            "치유감소(스킬)",
            "쿨타임감소(%)",
            "쿨타임감소최대치(%)",
            "사거리",
            "시야",
          ];
          if (btn == "statusBtn") {
            $(".statusEquipWrap>p>span").text("");
            $(".statusInfoWrap>p>span").text("");
            sEquip.map((e) => {
              const opts = Object.keys(e);
              for (i = 7; i < opts.length; i++) {
                if (!totalOpts[opts[i]]) {
                  totalOpts[opts[i]] = e[opts[i]];
                } else if (
                  totalOpts[opts[i]] &&
                  !exception.includes(totalOpts[opts[i]])
                ) {
                  totalOpts[opts[i]] = Number(
                    (totalOpts[opts[i]] + e[opts[i]]).toFixed(2)
                  );
                }
              }
              $(".statusEquip").append(
                `<li class="grade${e.ID.substring(0, 1)}">${e.name}</li>`
              );
            });
          } else if (btn == "bagStatusBtn") {
            $(".statusEquipWrap>p>span").text("(가방 기준)");
            $(".statusInfoWrap>p>span").text("(가방 기준)");
            bagEquip.map((e) => {
              if (e.ID == "empty") {
                return;
              }
              const bagEquipInfo = getById(e.ID, item)
                ? getById(e.ID, item)
                : getById(e.ID, drop);
              const opts = Object.keys(bagEquipInfo);
              for (i = 7; i < opts.length; i++) {
                if (!totalOpts[opts[i]]) {
                  totalOpts[opts[i]] = bagEquipInfo[opts[i]];
                } else if (
                  totalOpts[opts[i]] &&
                  exception.includes(totalOpts[opts[i]])
                ) {
                  totalOpts[opts[i]] = Number(
                    (totalOpts[opts[i]] + bagEquipInfo[opts[i]]).toFixed(2)
                  );
                }
              }
              $(".statusEquip").append(
                `<li class="grade${bagEquipInfo.ID.substring(0, 1)}">${
                  bagEquipInfo.name
                }</li>`
              );
            });
          }
          let totalOptsKey = Object.keys(totalOpts);
          totalOptsKey.filter((e) => {
            if (hp.includes(e)) {
              $(".upperOpts.hp .detailOpts .optValue")[
                hp.indexOf(e)
              ].parentElement.parentElement.parentElement.classList.remove(
                "hide"
              );
              $(".upperOpts.hp .detailOpts .optValue")[
                hp.indexOf(e)
              ].innerText = e.includes("%")
                ? parseInt(totalOpts[e] * 100) + "%"
                : totalOpts[e];
            } else if (mp.includes(e)) {
              $(".upperOpts.mp .detailOpts .optValue")[
                mp.indexOf(e)
              ].parentElement.parentElement.parentElement.classList.remove(
                "hide"
              );
              $(".upperOpts.mp .detailOpts .optValue")[
                mp.indexOf(e)
              ].innerText = e.includes("%")
                ? parseInt(totalOpts[e] * 100) + "%"
                : totalOpts[e];
            } else if (atk.includes(e)) {
              $(".upperOpts.atk .detailOpts .optValue")[
                atk.indexOf(e)
              ].parentElement.parentElement.parentElement.classList.remove(
                "hide"
              );
              $(".upperOpts.atk .detailOpts .optValue")[
                atk.indexOf(e)
              ].innerText = e.includes("%")
                ? parseInt(totalOpts[e] * 100) + "%"
                : totalOpts[e];
            } else if (def.includes(e)) {
              $(".upperOpts.def .detailOpts .optValue")[
                def.indexOf(e)
              ].parentElement.parentElement.parentElement.classList.remove(
                "hide"
              );
              $(".upperOpts.def .detailOpts .optValue")[
                def.indexOf(e)
              ].innerText = e.includes("%")
                ? parseInt(totalOpts[e] * 100) + "%"
                : totalOpts[e];
            } else if (autoAtk.includes(e)) {
              $(".upperOpts.autoAtk .detailOpts .optValue")[
                autoAtk.indexOf(e)
              ].parentElement.parentElement.parentElement.classList.remove(
                "hide"
              );
              $(".upperOpts.autoAtk .detailOpts .optValue")[
                autoAtk.indexOf(e)
              ].innerText = e.includes("%")
                ? parseInt(totalOpts[e] * 100) + "%"
                : totalOpts[e];
            } else if (skillAtk.includes(e)) {
              $(".upperOpts.skillAtk .detailOpts .optValue")[
                skillAtk.indexOf(e)
              ].parentElement.parentElement.parentElement.classList.remove(
                "hide"
              );
              $(".upperOpts.skillAtk .detailOpts .optValue")[
                skillAtk.indexOf(e)
              ].innerText = e.includes("%")
                ? parseInt(totalOpts[e] * 100) + "%"
                : totalOpts[e];
            } else if (spd.includes(e)) {
              $(".upperOpts.spd .detailOpts .optValue")[
                spd.indexOf(e)
              ].parentElement.parentElement.parentElement.classList.remove(
                "hide"
              );
              $(".upperOpts.spd .detailOpts .optValue")[
                spd.indexOf(e)
              ].innerText = e.includes("%")
                ? parseInt(totalOpts[e] * 100) + "%"
                : totalOpts[e];
            } else if (unique.includes(e)) {
              $(".upperOpts.unique .detailOpts .optValue")[
                unique.indexOf(e)
              ].parentElement.parentElement.parentElement.classList.remove(
                "hide"
              );
              $(".upperOpts.unique .detailOpts .optValue")[
                unique.indexOf(e)
              ].innerText = e.includes("%")
                ? parseInt(totalOpts[e] * 100) + "%"
                : totalOpts[e];
            } else if (etc.includes(e)) {
              $(".upperOpts.etc .detailOpts .optValue")[
                etc.indexOf(e)
              ].parentElement.parentElement.parentElement.classList.remove(
                "hide"
              );
              if (e == "치유감소(기공)") {
                $(".upperOpts.etc .detailOpts .optValue")[
                  etc.indexOf(e)
                ].innerText = "기본 공격 적중 시";
              } else if (e == "치유감소(스킬)") {
                $(".upperOpts.etc .detailOpts .optValue")[
                  etc.indexOf(e)
                ].innerText = "스킬 적중 시";
              } else {
                $(".upperOpts.etc .detailOpts .optValue")[
                  etc.indexOf(e)
                ].innerText = e.includes("%")
                  ? parseInt(totalOpts[e] * 100) + "%"
                  : totalOpts[e];
              }
            }
          });
        }

        $(".statusBtn").on("click", function (btn) {
          $("#statusWrap").removeClass("hide");
          showStatus(btn.target.classList[0]);
        });

        $("#statusWrap .closeBtn").on("click", function () {
          $("#statusWrap").addClass("hide");
        });

        $(".bagStatusBtn").on("click", function (btn) {
          $("#statusWrap").removeClass("hide");
          showStatus(btn.target.classList[0]);
        });

        //장비 추가
        $(".addBtn").on("click", function () {
          let sorted = $(".equipSort:checked").val();
          let selected = $(`.${sorted}DL:selected`).val();
          if ($(".tab." + selected).length > 0) {
          } else {
            equipAdd();
            selectedG.push(disassemble(sEquip[sEquip.length - 1]));
            matCalc();
            areaCalc();
            areaDrops();
            equipInfo();
            areaClick();
          }
        });

        //장비 제거
        $(document).on("click", ".delBtn", function () {
          for (i = 0; i < sEquip.length; i++) {
            if (sEquip[i].ID == this.classList[1]) {
              sEquip.splice(i, 1);
            }
          }
          for (i = 0; i < needMG.length; i++) {
            if (needMG[i].ID == this.classList[1]) {
              needMG.splice(i, 1);
            }
          }
          for (i = 0; i < selectedG.length; i++) {
            if (selectedG[i].ID == this.classList[1]) {
              selectedG.splice(i, 1);
            }
          }
          $(this).parents(".tab").remove();
          matCalc();
          areaCalc();
          areaDrops();
          areaClick();
          $("#equipInfo .equipNumber").text(sEquip.length);
          sEquip.sort();
        });

        $(".itemClearBtn").on("click", function () {
          sEquip.splice(0);
          needMG.splice(0);
          selectedG.splice(0);
          $("#equipBox .tab").remove();
          matCalc();
          areaCalc();
          areaDrops();
          areaClick();
          $("#equipInfo .equipNumber").text(sEquip.length);
        });

        //최단경로
        $(document).on("click", ".routeBtn", function () {
          $(this).toggleClass("clicked");
          let itemId = this.classList[1];
          let routeArr = itemRoute(itemId, checkedAOrder);
          $(routeArr).each(function () {
            $(`#equipBox .${itemId}.tab .routeBox .routeList`).append(
              `<li class='shortRoute'>${this.join(" -> ")}</li>`
            );
          });
        });

        $(document).on("click", ".refreshBtn", function () {
          let itemId = this.classList[1];
          $(this).siblings(".routeList").children().remove();
          $(`.tab.${itemId} .routeBox`).toggleClass("hide");
          let routeArr = itemRoute(itemId, checkedAOrder);
          $(routeArr).each(function () {
            $(`#equipBox .${itemId}.tab .routeBox .routeList`).append(
              `<li class='shortRoute'>${this.join(" -> ")}</li>`
            );
          });
        });

        $(".totalRouteBtn").on("click", function () {
          $("#totalRouteWrap").removeClass("hide");
        });

        $("#totalRouteWrap .totalRouteCalcBtn").on("click", function () {
          $("#totalRouteWrap").children(".shortRoute").remove();
          let routeArr = itemRoute("total", checkedAOrder);
          $(routeArr).each(function () {
            $("#totalRouteWrap").append(
              `<li class='shortRoute'><span>${this.join(" -> ")}</span></li>`
            );
          });
        });

        $("#totalRouteWrap .closeBtn").on("click", function () {
          $("#totalRouteWrap").addClass("hide");
        });

        let bagEquip = [
          { sort: "W", ID: "empty", location: "bagCtrlBtnW" },
          { sort: "C", ID: "empty", location: "bagCtrlBtnC" },
          { sort: "H", ID: "empty", location: "bagCtrlBtnH" },
          { sort: "B", ID: "empty", location: "bagCtrlBtnB" },
          { sort: "S", ID: "empty", location: "bagCtrlBtnS" },
          { sort: "A", ID: "empty", location: "bagCtrlBtnA" },
        ];
        let bagNow = [
          {
            ID: "DF007",
            name: "빵",
            stack: 2,
            limit: 5,
            location: "bagCtrlBtn0",
          },
          {
            ID: "DD002",
            name: "물",
            stack: 2,
            limit: 5,
            location: "bagCtrlBtn1",
          },
          "empty",
          "empty",
          "empty",
          "empty",
          "empty",
          "empty",
          "empty",
          "empty",
        ];

        function getBag(material, index) {
          let materialInfo;
          getById(material, drop)
            ? (materialInfo = getById(material, drop))
            : (materialInfo = getById(material, item));
          if (
            ["food", "drink", "material", "trap"].includes(materialInfo.sort)
          ) {
            if (!getById(materialInfo.ID, bagNow)) {
              $(`.pocket${index}`).children().remove();
              $(`.pocket${index}`).append(
                `<button type="button" class="bagCtrlBtn ${materialInfo.ID}">${materialInfo.name}<span class='mNumber'>(x${materialInfo.pickup})</span></button>`
              );
              bagNow[index] = {
                ID: materialInfo.ID,
                name: materialInfo.name,
                stack: materialInfo.pickup,
                limit: materialInfo.limit,
                location: `bagCtrlBtn${index}`,
              };
            } else {
              getById(materialInfo.ID, bagNow).stack += materialInfo.pickup;
              $(`.bagCtrlBtn.${materialInfo.ID} .mNumber`).text(
                `(x${getById(materialInfo.ID, bagNow).stack})`
              );
            }
          } else {
            $(`.pocket${index}`).children().remove();
            $(`.pocket${index}`).append(
              `<button type="button" class="bagCtrlBtn ${materialInfo.ID}">${materialInfo.name}</button>`
            );
            bagNow[index] = {
              ID: materialInfo.ID,
              name: materialInfo.name,
              stack: materialInfo.pickup,
              limit: materialInfo.limit,
              location: `bagCtrlBtn${index}`,
            };
          }
        }

        $(document).on("click", ".getMatBtn", function (e) {
          let material = e.target.parentElement.classList[1];
          if (
            getById(material, bagNow) &&
            ["F", "D", "M", "T"].includes(material.substring(1, 2))
          ) {
            getMat(
              material,
              getById(material, bagNow).location.substring(
                getById(material, bagNow).location.length - 1
              )
            );
          } else {
            getMat(material, bagNow.indexOf("empty"));
          }
          $(this).toggleClass("checkedMA");
        });

        function getMat(material, btn) {
          bagEquip.forEach((equip) => {
            if (material.substring(1, 2) == equip.sort && equip.ID == "empty") {
              let equipInfo;
              equip.ID = material;
              getById(equip.ID, drop)
                ? (equipInfo = getById(equip.ID, drop))
                : (equipInfo = getById(equip.ID, item));
              $(`.bagEquip.equip${equip.sort}`).children().remove();
              $(`.bagEquip.equip${equip.sort}`).append(
                `<button type="button" class="bagCtrlBtn ${equipInfo.ID}">${equipInfo.name}</button>`
              );
              btn = undefined;
            }
          });
          if (btn >= 0) {
            getBag(material, btn);
          }
        }

        function bagRemove(item, type, btn) {
          Number(type) >= 0
            ? (bagNow[type] = "empty")
            : (bagEquip.filter((equip) => equip.ID == item)[0].ID = "empty");
          $(`.${btn} .bagCtrlBtn`).remove();
        }

        function bagCtrl(mat) {
          let materials = [mat.ID, clickTemp.ID];
          let assembled;
          item.forEach((thing) => {
            if (
              thing.material.sort().toString() == materials.sort().toString()
            ) {
              assembled = thing;
            }
          });
          if (assembled) {
            if (bagNow.indexOf("empty") >= 0) {
              if (mat.stack < 2) {
                bagRemove(
                  mat.ID,
                  mat.btn.substring(mat.btn.length - 1),
                  mat.btn
                );
              } else {
                getById(mat.ID, bagNow).stack--;
                $(`.${mat.btn} .mNumber`).text(
                  `(x${getById(mat.ID, bagNow).stack})`
                );
              }
              if (clickTemp.stack < 2) {
                bagRemove(
                  clickTemp.ID,
                  clickTemp.btn.substring(clickTemp.btn.length - 1),
                  clickTemp.btn
                );
              } else {
                getById(clickTemp.ID, bagNow).stack--;
                $(`.${clickTemp.btn} .mNumber`).text(
                  `(x${getById(clickTemp.ID, bagNow).stack})`
                );
              }
              getMat(assembled.ID, bagNow.indexOf("empty"));
            } else if (
              getById(assembled.ID, bagNow) &&
              mat.stack >= 2 &&
              clickTemp.stack >= 2
            ) {
              if (mat.stack < 2) {
                bagRemove(
                  mat.ID,
                  mat.btn.substring(mat.btn.length - 1),
                  mat.btn
                );
              } else {
                getById(mat.ID, bagNow).stack--;
                $(`.${mat.btn} .mNumber`).text(
                  `(x${getById(mat.ID, bagNow).stack})`
                );
              }
              if (clickTemp.stack < 2) {
                bagRemove(
                  clickTemp.ID,
                  clickTemp.btn.substring(clickTemp.btn.length - 1),
                  clickTemp.btn
                );
              } else {
                getById(clickTemp.ID, bagNow).stack--;
                $(`.${clickTemp.btn} .mNumber`).text(
                  `(x${getById(clickTemp.ID, bagNow).stack})`
                );
              }
              getMat(
                assembled.ID,
                bagNow.findIndex((e) => e.ID == assembled.ID)
              );
            } else if (
              !getById(assembled.ID, bagNow) &&
              (mat.stack < 2 || clickTemp.stack < 2)
            ) {
              if (mat.stack < 2) {
                bagRemove(
                  mat.ID,
                  mat.btn.substring(mat.btn.length - 1),
                  mat.btn
                );
              } else {
                getById(mat.ID, bagNow).stack--;
                $(`.${mat.btn} .mNumber`).text(
                  `(x${getById(mat.ID, bagNow).stack})`
                );
              }
              if (clickTemp.stack < 2) {
                bagRemove(
                  clickTemp.ID,
                  clickTemp.btn.substring(clickTemp.btn.length - 1),
                  clickTemp.btn
                );
              } else {
                getById(clickTemp.ID, bagNow).stack--;
                $(`.${clickTemp.btn} .mNumber`).text(
                  `(x${getById(clickTemp.ID, bagNow).stack})`
                );
              }
              getMat(assembled.ID, bagNow.indexOf("empty"));
            }
          } else {
            let prevMat = {
              ID: clickTemp.ID,
              name: clickTemp.name,
              btn: clickTemp.btn,
              stack: clickTemp.stack == undefined ? 0 : clickTemp.stack,
            };
            let nowMat = {
              ID: mat.ID,
              name: mat.name,
              btn: mat.btn,
              stack: mat.stack == undefined ? 0 : mat.stack,
            };
            let mNumberArr = ["M", "T", "D", "F"];
            //장착-장착
            if (
              mat.btn.substring(0, 1) == "e" &&
              clickTemp.btn.substring(0, 1) == "e"
            ) {
              //교체 불가
            }
            //포켓-포켓
            else if (
              mat.btn.substring(0, 1) == "p" &&
              clickTemp.btn.substring(0, 1) == "p"
            ) {
              //이전(빈칸) : 현재(소지)
              if (prevMat.name == "empty" && nowMat.name != "empty") {
                bagNow[nowMat.btn.substring(6)] = "empty";
                $(`.${mat.btn}`).children().remove();
                $(`.${mat.btn}`).append(
                  `<button type="button" class="bagCtrlBtn ${prevMat.ID}"><span class='mNumber'></span></button>`
                );
                bagNow[prevMat.btn.substring(6)] = nowMat;
                $(`.${clickTemp.btn}`).children().remove();
                $(`.${clickTemp.btn}`).append(
                  `<button type="button" class="bagCtrlBtn ${nowMat.ID}">${nowMat.name}<span class='mNumber'></span></button>`
                );
                mNumberArr.includes(nowMat.ID.substring(1, 2))
                  ? $(`.${clickTemp.btn} .${nowMat.ID} .mNumber`).text(
                      `(x${nowMat.stack})`
                    )
                  : null;
              }
              //이전(소지) : 현재(빈칸)
              else if (prevMat.name != "empty" && nowMat.name == "empty") {
                bagNow[prevMat.btn.substring(6)] = "empty";
                $(`.${clickTemp.btn}`).children().remove();
                $(`.${clickTemp.btn}`).append(
                  `<button type="button" class="bagCtrlBtn ${nowMat.ID}"><span class='mNumber'></span></button>`
                );
                bagNow[nowMat.btn.substring(6)] = prevMat;
                $(`.${mat.btn}`).children().remove();
                $(`.${mat.btn}`).append(
                  `<button type="button" class="bagCtrlBtn ${prevMat.ID}">${prevMat.name}<span class='mNumber'></span></button>`
                );
                mNumberArr.includes(prevMat.ID.substring(1, 2))
                  ? $(`.${mat.btn} .${prevMat.ID} .mNumber`).text(
                      `(x${prevMat.stack})`
                    )
                  : null;
              }
              //이전(소지) : 현재(소지)
              else if (prevMat.name != "empty" && nowMat.name != "empty") {
                bagNow[prevMat.btn.substring(6)] = nowMat;
                $(`.${clickTemp.btn}`).children().remove();
                $(`.${clickTemp.btn}`).append(
                  `<button type="button" class="bagCtrlBtn ${nowMat.ID}">${nowMat.name}<span class='mNumber'></span></button>`
                );
                mNumberArr.includes(nowMat.ID.substring(1, 2))
                  ? $(`.${clickTemp.btn} .${nowMat.ID} .mNumber`).text(
                      `(x${nowMat.stack})`
                    )
                  : null;
                bagNow[nowMat.btn.substring(6)] = prevMat;
                $(`.${mat.btn}`).children().remove();
                $(`.${mat.btn}`).append(
                  `<button type="button" class="bagCtrlBtn ${prevMat.ID}">${prevMat.name}<span class='mNumber'></span></button>`
                );
                mNumberArr.includes(prevMat.ID.substring(1, 2))
                  ? $(`.${mat.btn} .${prevMat.ID} .mNumber`).text(
                      `(x${prevMat.stack})`
                    )
                  : null;
              }
            }
            //장착-포켓
            else {
              let fromP = prevMat.btn.substring(0, 1) == "p" ? prevMat : nowMat;
              let fromE = prevMat.btn.substring(0, 1) == "e" ? prevMat : nowMat;
              if (fromE.btn == `equip${fromP.ID.substring(1, 2)}`) {
                bagEquip.filter(
                  (e) => e.sort == fromE.btn.substring(5, 6)
                )[0].ID = fromP.ID;
                $(`.${fromE.btn}`).children().remove();
                $(`.${fromE.btn}`).append(
                  `<button type="button" class="bagCtrlBtn ${fromP.ID}">${fromP.name}</button>`
                );
                bagNow[fromP.btn.substring(6)] = fromE;
                $(`.${fromP.btn}`).children().remove();
                $(`.${fromP.btn}`).append(
                  `<button type="button" class="bagCtrlBtn ${fromE.ID}">${fromE.name}<span class='mNumber'></span></button>`
                );
              }
            }
          }
          clickTemp = { ID: null, btn: null };
          $(`.clickTemp`).removeClass("clickTemp");
        }

        let clickTemp = { ID: null, name: null, btn: null, stack: 0 };
        let tapped = false;
        $(document).on("mouseup touchend", ".bagCtrlBtn", function (e) {
          let matType = e.target.parentElement.classList[1].substring(
            e.target.parentElement.classList[1].length - 1
          );
          let clickTarget = {
            ID: e.target.classList[1],
            name: getById(e.target.classList[1], drop)
              ? getById(e.target.classList[1], drop).name
              : getById(e.target.classList[1], item).name,
            btn: e.target.parentElement.classList[1],
            stack: Number(matType) >= 0 ? bagNow[matType].stack : 1,
          };
          if (!tapped) {
            tapped = setTimeout(function () {
              tapped = null;
              if (clickTemp.ID) {
                bagCtrl(clickTarget);
              } else {
                clickTemp = clickTarget;
                $(`.${clickTemp.btn} .bagCtrlBtn`).toggleClass("clickTemp");
              }
            }, 300);
          } else {
            clearTimeout(tapped);
            tapped = null;
            bagRemove(
              clickTarget.ID,
              clickTarget.btn.substring(clickTarget.btn.length - 1),
              clickTarget.btn
            );
          }
          e.preventDefault();
        });

        $(".bagBtn").on("click", function (e) {
          $(".bagBox").toggleClass("hide");
          if ($(".bagBox").hasClass("hide")) {
            $(".bagBtn").text("가방 열기");
          } else {
            $(".bagBtn").text("가방 닫기");
          }
        });

        let bagHelp = false;
        $(".bagHelpBtn").on("click", function () {
          $(".bagHelp").toggleClass("hide");
          $(".bagHelpBtn").toggleClass("clicked");
          bagHelp ? (bagHelp = false) : (bagHelp = true);
        });

        let totalRouteHelp = false;
        $(".totalRouteHelpBtn").on("click", function () {
          $(".totalRouteHelpBtn").toggleClass("clicked");
          $(".totalRouteHelp").toggleClass("hide");
          totalRouteHelp ? (totalRouteHelp = false) : (totalRouteHelp = true);
        });
      }); //json
    });
  });
}); //docu ready
