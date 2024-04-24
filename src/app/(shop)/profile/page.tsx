import {Title} from "@/components";
import {auth} from "@/auth.config";
import {redirect} from "next/navigation";

const ProfilePage = async () => {

    const session = await auth()
    // console.log(session)
    // if(!session?.user){
    //     // redirect('auth/login?returnTo=/profile')
    //     redirect('/')
    // }

    return (
        <div>
            <Title title="Perfil"/>
            <pre>
                {
                    JSON.stringify(session?.user,null,2)
                }
            </pre>
            <h3 className='text-5xl mb-10'>{session?.user.role}</h3>
        </div>
    );
};

export default ProfilePage;