import { Children } from "react";
import { DataContext } from "./Context";

function ProviderContext({ children }: {children: React.ReactNode}) {


    return (
        <DataContext.Provider value={{}}>
            { children }
        </DataContext.Provider>
    )
}

export default ProviderContext;