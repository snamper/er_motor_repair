import { Component, OnInit } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { RepairInfoService } from '../../repair_info/service/repair_info.service';
import { CarMessageService } from '../../carMessage/service/carMessage.service';
import { CarMessage } from '../../carMessage/domain/carMessage.domain';
import { getDate } from '../../../utils/date';

@Component({
  selector: 'app-pages-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css', '../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css']
})
export class BillComponent {

    constructor(private repairInfoService: RepairInfoService, private carMessageSrv: CarMessageService) {

    }

    repair_info: any;
    carMessage: any = new CarMessage();

    statistics_info: any = {
        date: getDate(),
        total_dx: 0,   //总金额大写
        total: 0,      //总金额
        discount: 1,   //配件打折率
        payment: 0,    //实付金额
        total_payment: 0, //配件应付金额
        discount_total: 0,  //优惠金额
        remain: 0, //欠款金额
        time_total: 0,  //工时费用合计
        parts_total:0,  //配件费用合计

    }

    ngOnInit() {
        this.initInfo();     
    }

    initInfo() {
        this.repair_info = this.repairInfoService.repairInfo;
        this.carMessageSrv.initUpdate(this.repairInfoService.repairInfo.car_message_id)
                          .then(resp => this.carMessage = resp.data)
                          .then(() => this.getStatisticsInfo())
                          .catch(error => console.log(error))
    }

    getStatisticsInfo(){
        let parts_total: number = 0;
        for (var i=0; i<this.repair_info.parts_cost.length; i++){
            parts_total = parts_total + Number(this.repair_info.parts_cost[i].total);
        }
        let time_total: number = 0;
        for (var i=0; i<this.repair_info.time_cost.length; i++){
            time_total = time_total +  Number(this.repair_info.time_cost[i].total);
        }
        // console.log(parts_total)
        // console.log(time_total)
        
        this.statistics_info.time_total = time_total;
        this.statistics_info.parts_total = parts_total;

        this.statistics_info.discount = 1;
        this.statistics_info.payment = this.statistics_info.total;
        this.statistics_info.total_payment = this.statistics_info.parts_total * this.statistics_info.discount;
        this.statistics_info.discount_total = 0;
        this.statistics_info.remain = 0;

        this.statistics_info.total = parts_total + time_total;
        this.statistics_info.payment = this.statistics_info.total;
        this.statistics_info.total_dx = smalltoBIG(this.statistics_info.total);
    }

    

}


function smalltoBIG(n)   
{  
    var fraction = ['角', '分'];  
    var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];  
    var unit = [ ['元', '万', '亿'], ['', '拾', '佰', '仟']  ];  
    var head = n < 0? '欠': '';  
    n = Math.abs(n);  
 
    var s = '';  
 
    for (var i = 0; i < fraction.length; i++)   
    {  
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');  
    }  
    s = s || '整';  
    n = Math.floor(n);  
 
    for (var i = 0; i < unit[0].length && n > 0; i++)   
    {  
        var p = '';  
        for (var j = 0; j < unit[1].length && n > 0; j++)   
        {  
            p = digit[n % 10] + unit[1][j] + p;  
            n = Math.floor(n / 10);  
        }  
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零')  + unit[0][i] + s;  
    }  
    return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');  
}