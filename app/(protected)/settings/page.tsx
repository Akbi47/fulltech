import { auth, signOut } from "@/auth";

const SettingsPage = async () => {
    const session =  await auth()
    console.log(session);
    return ( <><div>{JSON.stringify(session)}</div><form action={async () => {
        "use server";
        await signOut();
    } }>
        <button>Sign out</button>
    </form></>
    );
    // return (<div>hello</div>)
}
 
export default SettingsPage;