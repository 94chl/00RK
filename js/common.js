$(document).ready(function () {
  let item = [];
  let weapon = [];
  let clothes = [];
  let helmet = [];
  let bracelet = [];
  let shoes = [];
  let accessory = [];
  let food = [];
  let drink = [];
  let trap = [];
  let material = [];
  let drop = [];
  let area = [];
  let dropArea = [];
  let cleanDA = [];
  let checkedAOrder = [];

  $.getJSON("./json/item.json", function (data) {
    $.each(data, function () {
      item.push(this);
      if (this.sort == "옷") {
        clothes.push(this);
      } else if (this.sort == "머리") {
        helmet.push(this);
      } else if (this.sort == "팔") {
        bracelet.push(this);
      } else if (this.sort == "다리") {
        shoes.push(this);
      } else if (this.sort == "장식") {
        accessory.push(this);
      } else if (this.sort == "음식") {
        food.push(this);
      } else if (this.sort == "음료") {
        drink.push(this);
      } else if (this.sort == "설치") {
        trap.push(this);
      } else if (this.sort == "재료") {
        material.push(this);
      } else {
        weapon.push(this);
      }
    });
    $.getJSON("./json/drop.json", function (data) {
      $.each(data, function () {
        drop.push(this);
      });
      $.getJSON("./json/area.json", function (data) {
        $.each(data, function () {
          area.push(this);
        });

        // 목록 생성
        for (i = 0; i < clothes.length; i++) {
          $("#clothesS").append("<option value=" + clothes[i].ID + ">" + clothes[i].name + "</option>")
        }
        $("#clothesS").children(":first").attr("selected");
        for (i = 0; i < helmet.length; i++) {
          $("#helmetS").append("<option value=" + helmet[i].ID + ">" + helmet[i].name + "</option>")
        }
        $("#helmetS").children(":first").attr("selected");
        for (i = 0; i < bracelet.length; i++) {
          $("#braceletS").append("<option value=" + bracelet[i].ID + ">" + bracelet[i].name + "</option>")
        }
        $("#braceletS").children(":first").attr("selected");
        for (i = 0; i < shoes.length; i++) {
          $("#shoesS").append("<option value=" + shoes[i].ID + ">" + shoes[i].name + "</option>")
        }
        $("#shoesS").children(":first").attr("selected");
        for (i = 0; i < accessory.length; i++) {
          $("#accessoryS").append("<option value=" + accessory[i].ID + ">" + accessory[i].name + "</option>")
        }
        $("#accessoryS").children(":first").attr("selected");
        for (i = 0; i < weapon.length; i++) {
          if ($("#weaponS").val() == weapon[i].sort) {
            $("#weapon2S").append("<option value=" + weapon[i].ID + " class='weapon2S'>" + weapon[i].name + "</option>")
          }
        }
        $("#weapon2S").children(":first").attr("selected");
        $("#weaponS").on("change", function () {
          $(".weapon2S").remove();
          for (i = 0; i < weapon.length; i++) {
            if ($("#weaponS").val() == weapon[i].sort) {
              $("#weapon2S").append("<option value=" + weapon[i].ID + " class='weapon2S'>" + weapon[i].name + "</option>");
              $("#weapon2S").children(":first").attr("selected");
            }
          }
        })

        // 계산 코드 시작 
        let selectedW, selectedC, selectedH, selectedB, selectedS, selectedA;

        // 하위재료 찾기
        function getById(id, arrays) {
          return arrays.filter(function (obj) {
            if (obj.ID == id) {
              return obj
            }
          })[0]
        }

        selectedW = getById($("#weapon2S").val(),item);
        selectedC = getById($("#clothesS").val(),item);
        selectedH = getById($("#helmetS").val(),item);
        selectedB = getById($("#braceletS").val(),item);
        selectedS = getById($("#shoesS").val(),item);
        selectedA = getById($("#accessoryS").val(),item);

        let materials = [];
        let needM =[];
        let selected = [];

        //장비의 필요 드랍 재료, 드랍 위치를 판명하여 dropArea 배열에 추가
        function disassemble(equip) {
          //materials 초기화, 삽입
          materials.splice(0);
          materials.push(equip.material1, equip.material2);
          //materials 항목을 드랍템으로 변환
          for (i = 0; i < materials.length;) {
            if (materials[i].substring(0, 1) != "D") {
              let test1 = getById(materials[i],item);
              materials.splice(i, 1);
              materials.push(test1.material1, test1.material2);
            } else {
              i++;
            }
          };
          materials.sort();
          let testM = [];
          testM = testM.concat(materials);
          selected.push({"ID":equip.ID, "drops":testM});

          //dropArea = {장비, 지역, 재료} 형식의 객체배열
          //함수가 실행될 때마다, 해당 장비에 대한 dropArea가 추가됨
          $(materials).each(function(index, name){
            $(area).each(function(number, areas){
              $(areas.drop).each(function(number, drops){
                if(drops.indexOf(name)>=0) {
                  dropArea.push({"equip": equip.ID, "area":areas.ID, "drops" : name})                  
                }
              })
            })
          })
          dropArea.sort(function(a, b) {
            return a.equip < b.equip ? -1 : a.equip > b.equip ? 1 : 0; 
          });                     
        };

        //dropArea를 참조하여 필요 갯수가 포함된 cleanDA 배열 리턴 
        function sortedDA() {
          cleanDA.splice(0)
          for(i=0; i<dropArea.length; i++) {
            let newThing = {"area":dropArea[i].area,"drops":dropArea[i].drops}
            cleanDA.push(newThing);
          }
          //dda 배열을 통해 중복 확인 및 필요 갯수 표시
          const dda = Object.values(cleanDA.reduce((r, e) => {
            let k = `${e.area}|${e.drops}`;
            if(!r[k]) r[k] = {...e, count: 1}
            else r[k].count += 1;
            return r;
          }, {}))
          dda.sort(function(b, a) {
            return a.count < b.count ? -1 : a.count > b.count ? 1 : 0; 
          });
          cleanDA.splice(0)
          cleanDA = cleanDA.concat(dda)
        }
        
        //필요 재료 갯수 표시 (재료만)
        function sortedM() {
          needM.splice(0)
          for(i=0;i<cleanDA.length;i++) {
            needM.push({"drops":cleanDA[i].drops,"count":cleanDA[i].count});
          }
          //nm 배열을 통해 중복 확인 및 필요 갯수 표시
          const nm = Object.values(needM.reduce((r, e) => {
            let k = `${e.drops}|${e.count}`;
            if(!r[k]) r[k] = {...e, counts: 1}
            else r[k].counts += 1;
            return r;
          }, {}))
          nm.sort(function(b, a) {
            return a.count < b.count ? -1 : a.count > b.count ? 1 : 0; 
          });
          needM.splice(0)
          needM = needM.concat(nm)
        }

        //장비 변경 시 dropArea 배열 수정
        function changeEquip(oldEquip) {
          $("input[type=checkbox]").prop("checked",false);
          for(i=0; i<dropArea.length;) {
            if(oldEquip.ID == dropArea[i].equip) {
              dropArea.splice(i,1);
            } else {
              i++
            }
          }
          selected.splice(selected.indexOf(getById(oldEquip.ID,selected)),1)
          checkedAOrder.splice(0);
          $(".active").removeClass();
          $("#area .area").children(".flag").remove();    
        }
        
        //선택 장비 정보 표시
        function equipInfo(equip) {
          let optionKey = Object.keys(equip);
          let optionValue = Object.values(equip);
          let sort = equip.ID.substring(1, 2);
          let grade = equip.ID.substring(0, 1);
          let equipDrops = getById(equip.ID, selected).drops;
          let lowerM = [];
          let lowerM1 = equip.material1;
          let lowerM2 = equip.material2;
          $("#equipInfo ul.selected" + sort + " .name").children().remove();
          $("#equipInfo ul.selected" + sort + " .option").children().remove();
          $("#equipInfo ul.selected" + sort + " .lowerM").children().remove();
          $("#equipInfo ul.selected" + sort + " .drops").children().remove();
          $("#equipInfo ul.selected" + sort + " .name").append(
            "<p class='grade"+grade+"'>" + equip.name + "</p>"
          )
          for (i = 5; i < optionKey.length; i++) {
            if(optionKey[i].includes("%")) {
              $("#equipInfo ul.selected" + sort+" .option").append(
                "<li>" + optionKey[i] + " : " + optionValue[i]*100 + "%</li>"
              )
            } else {
              $("#equipInfo ul.selected" + sort+" .option").append(
                "<li>" + optionKey[i] + " : " + optionValue[i] + "</li>"
              )
            }            
          }         
          for (i = 0; i < equipDrops.length; i++) {
            $("#equipInfo ul.selected" + sort+" .drops").append(
              "<span>[" + getById(equipDrops[i],drop).name + "]</span>"
           )
          }

          $(".materials .selectedAll").children().remove();
          for (i = 0; i < needM.length; i++) {
            $(".materials .selectedAll").append(
              "<span class='dropM "+getById(needM[i].drops,drop).ID+"'>" + getById(needM[i].drops,drop).name + "<span class='mNumber'>(x"+needM[i].count+")</span></span>"
           )
          }
          if(lowerM1.substring(0,1) == "D") {
            lowerM.push({"name":getById(lowerM1, drop).name, "grade": lowerM1.substring(0,1)})
          } else {
            lowerM.push({"name":getById(lowerM1, item).name, "grade": lowerM1.substring(0,1)})
          }          
          if(lowerM2.substring(0,1) == "D") {
            lowerM.push({"name":getById(lowerM2, drop).name, "grade": lowerM2.substring(0,1)})
          } else {
            lowerM.push({"name":getById(lowerM2, item).name, "grade": lowerM2.substring(0,1)})
          }

          for (i = 0; i < lowerM.length; i++) {
            $("#equipInfo ul.selected" + sort+" .lowerM").append(
              "<span class='grade"+lowerM[i].grade+"'>[" + lowerM[i].name + "]</span>"
           )
          }
        }

        //선택 장비 드랍위치 표시
        function showDA() {
          $("#area .area .drops").children().remove();
          $("#area .area strong").text("");
          $(cleanDA).each(function() {
            $("#area .area#"+(this).area+" .drops").append("<li class='dropM "+(this).drops+"'>"+getById((this).drops,drop).name+"<span class='mNumber'>(x"+(this).count+")</span></li>")
          })
          $("#area .area .drops").each(function(i,t) {
            $(t).siblings("label").children("strong").text(" ("+$(t).children().length+"가지)")
          })
        }

        // 장비 선택 변경   
        $("#weaponS").on("change", function () {
          changeEquip(selectedW);
          selectedW = getById($("#weapon2S").val(),item);
          disassemble(selectedW);
          sortedDA();     
          sortedM(); 
          showDA();
          equipInfo(selectedW);
        })
        $("#weapon2S").on("change", function () {
          changeEquip(selectedW);
          selectedW = getById($("#weapon2S").val(),item);
          disassemble(selectedW);
          sortedDA();    
          sortedM();  
          showDA();
          equipInfo(selectedW);          
        })
        $("#clothesS").on("change", function () {
          changeEquip(selectedC);
          selectedC = getById($("#clothesS").val(),item);
          disassemble(selectedC);
          sortedDA();     
          sortedM();
          showDA()
          equipInfo(selectedC);
        })
        $("#helmetS").on("change", function () {
          changeEquip(selectedH);
          selectedH = getById($("#helmetS").val(),item);
          disassemble(selectedH);
          sortedDA();    
          sortedM();  
          showDA()
          equipInfo(selectedH)
        })
        $("#braceletS").on("change", function () {
          changeEquip(selectedB);
          selectedB = getById($("#braceletS").val(),item);
          disassemble(selectedB);
          sortedDA();   
          sortedM();   
          showDA()
          equipInfo(selectedB)
        })
        $("#shoesS").on("change", function () {
          changeEquip(selectedS);
          selectedS = getById($("#shoesS").val(),item);
          disassemble(selectedS);
          sortedDA();   
          sortedM();    
          showDA()
          equipInfo(selectedS)
        })
        $("#accessoryS").on("change", function () {
          changeEquip(selectedA);
          selectedA = getById($("#accessoryS").val(),item);
          disassemble(selectedA);
          sortedDA();
          sortedM();      
          showDA()
          equipInfo(selectedA)
        })
        
        //장비 체크박스 클릭시
        $(".checkboxE").on("change", function() {
          $(".materials .selectedAll").children().removeClass('checkedME')
          $("#area .area .drops").children().removeClass('checkedME')
          let checkedE = [];
          $(".checkboxE:checked").each(function() {
            checkedE.push({"ID":$("#equipSelect #"+$(this).attr("id")+"S").val(),"drops":getById($("#equipSelect #"+$(this).attr("id")+"S").val(),selected).drops});
          })
          for(i=0; i<checkedE.length; i++) {
            for(o=0; o<checkedE[i].drops.length; o++){
              $(".materials .selectedAll ."+checkedE[i].drops[o]).addClass('checkedME')
              $("#area .area .drops ."+checkedE[i].drops[o]).addClass('checkedME')
            }
          }
        })
        
        //위치 체크박스 클릭시
        $(".checkboxA").on("change", function() {
          $(".materials .selectedAll").children().removeClass('checkedMA');
          $("#area .area .drops").children().removeClass("checkedMA");      
          $("#area .area").children(".flag").remove();    
          let checkedA = [];
          $(".checkboxA:checked").each(function() {
            checkedA.push($(this).parents('.area').attr("id"))
          })
          let checkedAM = [];
          for(i=0; i<cleanDA.length; i++) {
            for(o=0; o<checkedA.length; o++) {
              if(cleanDA[i].area == checkedA[o]){
                checkedAM.push(cleanDA[i].drops)
              }
            }            
          }
          checkedAM = Array.from(new Set(checkedAM))
          for(u=0; u<checkedAM.length; u++) {
            $(".materials .selectedAll ."+checkedAM[u]).addClass('checkedMA')
            $("#area .area .drops ."+checkedAM[u]).addClass('checkedMA')
          }
          if($(this).siblings("label").hasClass("active")) {
            let deleteR = $(this).parents('.area').attr("id");
            checkedAOrder.splice(checkedAOrder.indexOf(deleteR),1)
          } else {
            checkedAOrder.push($(this).parents('.area').attr("id"))
          }
          $(".area label").removeClass();
          for(i=0; i<checkedAOrder.length; i++) {
            $("#area #"+checkedAOrder[i]).prepend("<div class='flag route"+(i+1)+"'>"+(i+1)+"</div>");
            $("#area #"+checkedAOrder[i]+" label").addClass("active route"+(i+1));
          }
        })

        $(".tabBtn").on("click", function(e) {
          let target = $(e.currentTarget).siblings('.scroll')
          target.toggleClass('hide')
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
        
        disassemble(selectedW);
        disassemble(selectedC);
        disassemble(selectedH);
        disassemble(selectedB);
        disassemble(selectedS);
        disassemble(selectedA);
        sortedDA();
        sortedM();
        showDA()
        equipInfo(selectedW);
        equipInfo(selectedC);
        equipInfo(selectedH);
        equipInfo(selectedB);
        equipInfo(selectedS);
        equipInfo(selectedA);
      });
    });
  });
});
