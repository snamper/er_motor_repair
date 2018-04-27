import {Component,OnInit} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, EmailValidator } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';
import { map, delay, debounceTime } from 'rxjs/operators';

import { ReuseTabService,ReuseTabMatchMode } from '@delon/abc';
import { NzMessageService } from 'ng-zorro-antd';

import { CarMessageService } from '../service/carMessage.service';
import { CarMessage } from '../domain/carMessage.domain'; 
import { RolesService } from '../../roles/service/roles.service'; 
import { ProjectsService } from '../../projects/service/projects.service';

@Component({
    selector: 'car_message-form',
    templateUrl: './form.component.html'
})
export class CarMessageFormComponent implements OnInit {

    form: FormGroup;
    car_message: CarMessage;
    card_title = "";
    multi_roles: any[];

    constructor(
        private reuseTabService: ReuseTabService,
        private fb: FormBuilder,
        private router: Router,
        private carMessageSerivce: CarMessageService,
        private msg: NzMessageService
        ) {
    }
    
    ngOnInit() {
        this.setTitle();
        if (this.carMessageSerivce.formOperation == 'create') {this.car_message=null;}
        if (this.carMessageSerivce.formOperation == 'update') {this.initUpdate();}
        this.form = this.fb.group({
            owner_name : [this.car_message? this.car_message.owner_name : null, Validators.required ],
            phone_num : [this.car_message? this.car_message.phone_num : null, Validators.required],
            plate_num : [this.car_message? this.car_message.plate_num : null, Validators.required],
            car_color : [this.car_message? this.car_message.car_color : null],
            vin : [this.car_message? this.car_message.vin : null],
            car_type : [this.car_message? this.car_message.car_type : null],
            car_brand : [this.car_message? this.car_message.car_brand : null],
            car_series : [this.car_message? this.car_message.car_series : null],
            engine_num : [this.car_message? this.car_message.engine_num : null],
            engine_type : [this.car_message? this.car_message.engine_type : null],
            buy_date : [this.car_message? this.car_message.buy_date : null],
            next_maintain_date : [this.car_message? this.car_message.next_maintain_date : null],
            next_maintain_mileage : [this.car_message? this.car_message.next_maintain_mileage : null],
            next_annual_trial_date : [this.car_message? this.car_message.next_insurance_date : null],
            next_insurance_date : [this.car_message? this.car_message.next_insurance_date : null],
            insurance_name : [this.car_message? this.car_message.insurance_name : null],
            latest_mileage : [this.car_message? this.car_message.latest_mileage : null],
            car_remark : [this.car_message? this.car_message.car_remark : null]
        });
        this.form.controls["owner_name"].setValue(this.car_message? this.car_message.owner_name : "")
    }

    setTitle() {
        if (this.carMessageSerivce.formOperation == "create") { 
            this.reuseTabService.title ="创建车辆信息"; 
            this.card_title = "创建车辆信息";
        }
        if (this.carMessageSerivce.formOperation == "update") { 
            this.reuseTabService.title ="修改车辆信息";
            this.card_title = "修改车辆信息";
        }
    }

    _submitForm() {
        for (const i in this.form.controls) {
            this.form.controls[ i ].markAsDirty();
        }
        if (this.form.invalid) return ;
        this.formatForm();

        let op = this.carMessageSerivce.formOperation;
        if (op == 'create') this.carMessageSerivce.add(this.form.value).then(resp => {
            if (resp.error) { 
                this.msg.error(resp.error);
            } else {
                this.msg.success('车辆信息 ' + resp.data.name + ' 已创建！');
                this.goBack();
            }
            }).catch(error => this.msg.error(error));
        if (op == 'update') this.carMessageSerivce.update(this.car_message.id, this.form.value).then(resp => {
            if (resp.error) { 
                this.msg.error(resp.error);
            } else {
                this.msg.success('车辆信息 ' + resp.data.name + ' 已更新！');
                this.goBack();
            }
            }).catch(error => this.msg.error(error));

    }

    goBack() {
        this.router.navigateByUrl('/carMessage/page');
    }

    formatForm() {
        // 格式化form中的roles属性
        // this.car_message = this.form.value;
    }

    initUpdate() {
        this.car_message = this.carMessageSerivce.carMessage;
    }
}