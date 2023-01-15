import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateOrganizationDto } from '@interfaces/organization';
import { OrganizationService } from '../../organization.service';

@Component({
  selector: 'desktop-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.scss'],
})
export class CreateOrganizationComponent {
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  constructor(private organizationService: OrganizationService) {}

  onSubmit() {
    if (this.form.invalid) return;
    this.organizationService.createOrganization(this.form.value as CreateOrganizationDto);
  }
}
