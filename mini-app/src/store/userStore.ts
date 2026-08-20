import { create } from "zustand";


interface UserStore {

completed:boolean;

completeOnboarding:()=>void;

}



export const useUserStore = create<UserStore>((set)=>({

completed:false,


completeOnboarding:()=>{

set({

completed:true

})

}


}));