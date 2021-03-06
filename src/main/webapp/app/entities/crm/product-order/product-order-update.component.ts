import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { IProductOrder } from 'app/shared/model/crm/product-order.model';
import { ProductOrderService } from './product-order.service';
import { ICustomer } from 'app/shared/model/crm/customer.model';
import { CustomerService } from 'app/entities/crm/customer';

@Component({
    selector: 'jhi-product-order-update',
    templateUrl: './product-order-update.component.html'
})
export class ProductOrderUpdateComponent implements OnInit {
    productOrder: IProductOrder;
    isSaving: boolean;

    customers: ICustomer[];
    placedDate: string;

    constructor(
        private jhiAlertService: JhiAlertService,
        private productOrderService: ProductOrderService,
        private customerService: CustomerService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ productOrder }) => {
            this.productOrder = productOrder;
            this.placedDate = this.productOrder.placedDate != null ? this.productOrder.placedDate.format(DATE_TIME_FORMAT) : null;
        });
        this.customerService.query().subscribe(
            (res: HttpResponse<ICustomer[]>) => {
                this.customers = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.productOrder.placedDate = this.placedDate != null ? moment(this.placedDate, DATE_TIME_FORMAT) : null;
        if (this.productOrder.id !== undefined) {
            this.subscribeToSaveResponse(this.productOrderService.update(this.productOrder));
        } else {
            this.subscribeToSaveResponse(this.productOrderService.create(this.productOrder));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IProductOrder>>) {
        result.subscribe((res: HttpResponse<IProductOrder>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackCustomerById(index: number, item: ICustomer) {
        return item.id;
    }
}
