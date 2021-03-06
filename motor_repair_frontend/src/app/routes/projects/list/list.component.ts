import {Component,OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { tap } from 'rxjs/operators';

import { ProjectsService } from '../service/projects.service';
import { UserStatusPipe } from '../../../pipes/pipes'; 

@Component({
    selector: 'project-list',
    templateUrl: './list.component.html'
})
export class ProjectsListComponent implements OnInit {

    q: any = {
        page_index: 1,
        page_size: 15,
        sort_field: "name",
        sort_direction: "desc",
        name: null,
        actived: null,
        deadline: null
    };
    // 记录总数
    total: number;
    // 用户列表
    data: any[] = [];
    // 删除对象
    delObj = null;

    loading = false;

    actived_status = [
        { text: '不限定', value: null },
        { text: '已激活', value: true },
        { text: '未激活', value: false }
    ]
    sortMap: any = {};

    constructor(
        private http: _HttpClient, 
        public msg: NzMessageService,
        private projectsService: ProjectsService,
        private router: Router
        ) {}

    ngOnInit() {
        this.getData();
    }

    _onReuseInit() {
        this.getData();
    }

    getData() {
        this.formatForm()
        this.loading = true;
        this.projectsService.listOnePage(this.q)
                         .then(resp => {
                             if (resp.error) {
                                this.msg.error(resp.error);
                                this.loading = false;
                             } else {
                                this.data = resp.data;this.total = resp.total_entries; 
                                this.loading = false;
                             }
                         })
                         .catch((error) => {this.msg.error(error); this.loading = false;})
    }

    remove(obj) {
        this.confirmContent = "确定要删除项目: " + obj.name + " ?";
        this.modalVisible = true;
        this.delObj = obj;
    }

    delete() {
        this.projectsService.delete(this.delObj.id)
                         .then(resp => this.msg.success("项目:" + resp.data.name + "已删除！")).then(resp => this.getData() )
                         .catch((error) => {this.msg.error(error); this.loading = false;})
    }

    add() {
        this.projectsService.formOperation = 'create';
        this.projectsService.isUpdate=false;
        this.router.navigateByUrl('/projects/form');
    }

    update(id) {
        this.projectsService.formOperation='update';
        this.projectsService.initUpdate(id)
            .then(result => { this.projectsService.project = result.data;})
            .then(() => this.router.navigateByUrl('/projects/form')).catch((error)=>
            this.msg.error(error)); 
    }

    activate(id) {
        this.projectsService.activate(id)
            .then(resp => this.msg.success("用户:" + resp.data.name + "已激活！")).then(resp => this.getData() )
            .catch((error) => {this.msg.error(error); this.loading = false;})
    }

    disable(id) {
        this.projectsService.disable(id)
            .then(resp => this.msg.success("用户:" + resp.data.name + "已禁用！")).then(resp => this.getData() )
            .catch((error) => {this.msg.error(error); this.loading = false;})
    }

    sort(field: string, value: any) {
        this.q.sort_field = field;
        if (value=="ascend") {this.q.sort_direction = "asc"}
        if (value=="descend") {this.q.sort_direction = "desc"}
        this.getData();
    }

    pageChange(pi: number) {
        this.q.page_index = pi;
        this.getData();
    }

    formatForm() {
        if ((this.q.name == null)||(this.q.name == "")){delete this.q.name}
        if (this.q.actived == null){delete this.q.actived}
        if ((this.q.deadline == null)||(this.q.deadline == "")){delete this.q.deadline}
    }

    // 删除确认框相关
    confirmContent = ""
    modalVisible = false;

    showModal = () => {
        this.modalVisible = true;
    }

    handleOk = (e) => {
        this.modalVisible = false;
        this.delete();
    }

    handleCancel = (e) => {
        this.modalVisible = false;
    }
}