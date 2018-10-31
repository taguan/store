import { NgModule } from '@angular/core';

import { StoreSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
    imports: [StoreSharedLibsModule],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [StoreSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class StoreSharedCommonModule {}
