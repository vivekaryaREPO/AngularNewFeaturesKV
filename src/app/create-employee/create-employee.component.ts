import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder,Validators, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { CustomValidators } from '../shared/custom.validator';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../employee/employee.service';
import { IEmployee } from '../employee/IEmployee';
import { ISkill } from '../employee/ISkill';
@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm:FormGroup=new FormGroup({});
  fullNameLength:number=0;
  validationMessages:{ [key: string]: any } = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 5 characters.',
      'maxlength': 'Full Name must be less than 10 characters.'
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain':'Email domain should be dell.com'
    },
    'confirmEmail': {
      'required': 'Email is required.',
      'emailDomain':'Email domain should be dell.com'
    },
    
    'emailGroup': {
      'emailMismatch': 'Email and confirm emails do not match'
    },
    'phone': {
      'required': 'Phone is required.'
    }
    // },
    // 'skillName': {
    //   'required': 'Skill Name is required.',
    // },
    // 'experienceInYears': {
    //   'required': 'Experience is required.',
    // },
    // 'proficiency': {
    //   'required': 'Proficiency is required.',
    // },
  };
  constructor(private fb:FormBuilder,private _activatedRoute:ActivatedRoute,private _employeeService:EmployeeService) { }
  
  formError:{[key:string]:any}={
    // 'fullName':'',
    // 'email':'',
    // 'confirmEmail':'',
    // 'emailGroup':'',
    // 'phone':'',
    // 'skillName':'',
    // 'experienceInYears':'',
    // 'proficiency':''
  }

  ngOnInit(): void {
    // this.employeeForm=new FormGroup(
    //   {
    //     fullName: new FormControl(),
    //     email:new FormControl(),
    //     skills:new FormGroup({
    //       skillName:new FormControl(),
    //       experienceInYears:new FormControl(),
    //       proficiency:new FormControl()
    //     })
        
    //   }
    // );
    this.employeeForm=this.fb.group({
      fullName:['',[Validators.required,Validators.minLength(5),Validators.maxLength(10)]],
      emailGroup:this.fb.group({
        email:['',[Validators.required,CustomValidators.emailDomainWithParameter('dell.com')]],   //default value
      confirmEmail:['',[Validators.required,CustomValidators.emailDomainWithParameter('dell.com')]],
      },{ validator: matchEmail }),
      contactPreference:['email'], 
      phone:[''],
      skills:this.fb.array([this.addSkillFormGroup()])// when form loads, we wanna at least one form group so we called the function. 
      
    });
    // this.employeeForm.valueChanges.subscribe((value:any)=>{
    //   console.log(JSON.stringify(value));
    // });
    this.employeeForm.get('fullName')?.valueChanges.subscribe((value:string)=>{this.fullNameLength=value.length});
    this.employeeForm.valueChanges.subscribe(data=>{
      this.logValidationErrors(this.employeeForm);
    })

    this.employeeForm.get('contactPreference')?.valueChanges.subscribe((value:string)=>{
      this.onContactPrefrenceChange(value);});

      this._activatedRoute.paramMap.subscribe(params=>{
        const empId=  Number(params.get('id'));
        if(empId)
        {
          this.getEmployee(empId);
        }
      })
    }

    getEmployee(id:number):void{
      this._employeeService.getEmployee(id).subscribe((employee:IEmployee)=>{
        this.editEmployee(employee);
      },
      (err:any)=>
      {
        console.log(err);
      })

    }

    editEmployee(employee:IEmployee):void
    {
      this.employeeForm.patchValue(
        {
          fullName: employee.fullName,
          contactPreference: employee.contactPreference,
          emailGroup: {
            email: employee.email,
            confirmEmail: employee.email
          },
          phone: employee.phone
        }
      );

      this.employeeForm.setControl('skills',this.setExistingSkills(employee.skills));
    }

    setExistingSkills(skillSets:ISkill[]):FormArray{
      const formArray=new FormArray([]);
      skillSets.forEach(s=>
        {
          formArray.push(this.fb.group({
            skillName:s.skillName,
            experienceInYears:s.experienceInYears,
            proficiency:s.proficiency
          }));
        });
        return formArray;
    }
    test():FormArray
    {
      let test=this.employeeForm.get('skills')?.invalid;
      return this.employeeForm.get('skills') as FormArray;
      

    }

    addSkillButtonClick():void
    {
      
     (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
    }

    onSubmit():void{
      console.log(this.employeeForm);
      // console.log(this.employeeForm.controls['fullName'].touched);
      // console.log(this.employeeForm.controls['fullName'].value);
      // console.log(this.employeeForm.controls['email'].touched);
      // console.log(this.employeeForm.controls['email'].value);
    }
    oNLoadDataClick():void{

      // this.employeeForm.setValue(
      //   {
      //     fullName:"Vvek" ,
      //     email:"b@b.com",
      //     skills:{
      //       skillName:"c#",
      //       experienceInYears:"java",
      //       proficiency:"beginner"
      //     }
          
      //   }
        
      // );

      // this.logValidationErrors(this.employeeForm);
      // console.log(this.formError);

      //1. first way to create formArray. Its used for creating elements dynamically
      const formArray=new FormArray([
        new FormControl('John', Validators.required),
        new FormGroup({
          country:new FormControl('',Validators.required)
        }),
        new FormArray([])
      ]);

      console.log(formArray.length);
      for(const control of formArray.controls)
      {
        if(control instanceof FormControl)
        {
          console.log('control is FormControl');
        }
        if(control instanceof FormGroup)
        {
          console.log('control is FormGroup');
        }
        if(control instanceof FormArray)
        {
          console.log('control is FormArray');
        }
      }

      //2nd way to create formArray i.e using formBuilder class.
      //this is to create array of formcontrol
      const formArray1=this.fb.array([
        new FormControl('John', Validators.required),
        new FormControl('IT', Validators.required),
        new FormControl('', Validators.required),
        
      ]);
      console.log(formArray1.value);
      console.log(formArray1.valid);//if one element is false, all become false, so we keep only alike items in formArray.
      formArray1.push(new FormControl('Mark'));

      //2nd way to create formArray i.e using formBuilder class.
      //this is to create array of formGroup
      const formArray2=this.fb.group([
        new FormControl('John', Validators.required),
        new FormControl('IT', Validators.required),
        new FormControl('', Validators.required),
        
      ]);
      console.log(formArray2.value);
      console.log(formArray2.valid);//if one element is false, all become false, so we keep only alike items in formArray.
      
    }
    onContactPrefrenceChange(phone:string):void{
      if(phone==='phone')
      {
        //use array to set multiple validators
        this.employeeForm.get('phone')?.setValidators(Validators.required);
        this.employeeForm.get('email')?.clearValidators();
      }
      else
      {
        this.employeeForm.get('phone')?.clearValidators();
        this.employeeForm.get('email')?.setValidators([Validators.required]);
        
      }

      this.employeeForm.get('phone')?.updateValueAndValidity();
      this.employeeForm.get('email')?.updateValueAndValidity();
      
    }

    logValidationErrors(group:FormGroup=this.employeeForm):void{
        console.log(Object.keys(group.controls).forEach((key:string)=>{
          const abstractControl=group.get(key);
         
          // abstractControl?.disable();
          // abstractControl?.markAsDirty();
          // console.log("key: "+key+"    value="+abstractControl?.value);
          // console.log(abstractControl?.dirty);
          this.formError[key]='';
          if(abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty||abstractControl.value!==''))
          {
            const messages=this.validationMessages[key];
            console.log(messages);
            for(const errorKey in abstractControl.errors)
            {
              if(errorKey)
              {
                this.formError[key]+=messages[errorKey]+' ';
              }
            }

          }
          if(abstractControl instanceof FormGroup)
          {
            this.logValidationErrors(abstractControl);
          }
          //we dont need this as we have shifted the error display logic to the front end, for our dynamic form array
          // if(abstractControl instanceof FormArray)
          // {
          //   for(const control of abstractControl.controls)
          //   {
          //     if(control instanceof FormGroup)
          //     this.logValidationErrors(control);
          //   }
            
          // }
          //we don't need else block anymore because the emails don't match error will be added to errors collection of emailGroup
          // else
          // {
          //   this.formError[key]='';
          //   // abstractControl?.disable();
          //   // abstractControl?.markAsDirty();
          //   // console.log("key: "+key+"    value="+abstractControl?.value);
          //   // console.log(abstractControl?.dirty);
          //   if(abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty))
          //   {
          //     const messages=this.validationMessages[key];
          //     console.log(messages);
          //     for(const errorKey in abstractControl.errors)
          //     {
          //       if(errorKey)
          //       {
          //         this.formError[key]+=messages[errorKey]+' ';
          //       }
          //     }

          //   }
          // }
        }));

    }
    getFormArrayLength():number
    {
      return (<FormArray>this.employeeForm.get('skills')).length ;
    }
    addSkillFormGroup():FormGroup
    {
      
      return this.fb.group({
        skillName:['', Validators.required],
        experienceInYears:['', Validators.required],
        proficiency:['', Validators.required]
        
    });
    }

    removeSkillButtonClick(skillGroupIndex:number):void{
     //we wanna mark the form touched and dirty 
     const skillsFormArray=(<FormArray> this.employeeForm.get('skills'));
     skillsFormArray.removeAt(skillGroupIndex);
     skillsFormArray.markAsDirty();
     skillsFormArray.markAsTouched();
    }
}
function emailDomain(control:AbstractControl):{[key:string]:any} | null {
  const email:string=control.value;
  const domainName:string= email.substring(email.lastIndexOf('@')+1);
  if (domainName=== '' || domainName==='arya.com')
  return null;
  else
  return {'emailDomain':true}
}

//closure i.e function returning finction
// function emailDomainWithParameter(domain:string){
// return (control:AbstractControl):{[key:string]:any} | null => {
//   const email:string=control.value;
//   const domainName:string= email.substring(email.lastIndexOf('@')+1);
//   if (domainName=== '' || domain.toLowerCase()===domainName.toLowerCase())
//   return null;
//   else
//   return {'emailDomain':true}
// };}

function matchEmail(group:AbstractControl):{[key:string]:any}|null
{
  const emailControl=group.get('email');
  const confirmemailControl=group.get('confirmEmail');
  if(emailControl?.value===confirmemailControl?.value || (confirmemailControl?.pristine && confirmemailControl.value===''))
  {
    return null;
  }
  else
  {
    return {'emailMismatch':true}; //this object will be attached to errors collection of emailFormGroup
  }

}