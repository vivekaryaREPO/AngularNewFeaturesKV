import { AbstractControl } from "@angular/forms";
export class CustomValidators
{

    //closure i.e function returning finction
static emailDomainWithParameter(domain:string){
    return (control:AbstractControl):{[key:string]:any} | null => {
      const email:string=control.value;
      const domainName:string= email.substring(email.lastIndexOf('@')+1);
      if (domainName=== '' || domain.toLowerCase()===domainName.toLowerCase())
      return null;
      else
      return {'emailDomain':true}
    };}
}