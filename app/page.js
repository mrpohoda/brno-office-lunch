import 'bootstrap/dist/css/bootstrap.css'
import {Racek} from "../components/racek";
import {Opice} from "../components/opice";
import {SpravneMisto} from "../components/spravne-misto";
import {Yvy} from "../components/yvy";
import {Klub} from "../components/klub";
import {Nepal} from "../components/nepal";
import {Borgeska} from "../components/borgeska";
import {Suspense} from "react";
import {Loader} from "../components/loader";

export const revalidate = 0

export default async function Home() {
    return (
        <div className="container">
            <div className="row mb-3 mt-4">
                <Suspense fallback={<Loader />}>
                    <Racek />
                </Suspense>
                <Suspense fallback={<Loader />}>
                    <Opice />
                </Suspense>
            </div>

            <div className="row mb-3">
                <Suspense fallback={<Loader />}>
                    <Klub />
                </Suspense>
                <Suspense fallback={<Loader />}>
                    <Nepal />
                </Suspense>
            </div>

            <div className="row mb-3">
                <Suspense fallback={<Loader />}>
                    <Yvy />
                    
                </Suspense>
                <Suspense fallback={<Loader />}>
                    <Borgeska />
                </Suspense>
            </div>

            <div className="row mb-3">
                <Suspense fallback={<Loader />}>
                    <SpravneMisto />
                </Suspense>
            </div>
        </div>
    )
}
