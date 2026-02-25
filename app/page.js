import 'bootstrap/dist/css/bootstrap.css'
import {Racek} from "../components/racek";
import {Opice} from "../components/opice";
import {Klub} from "../components/klub";
import {Nepal} from "../components/nepal";
import {Suspense} from "react";
import {Loader} from "../components/loader";

export const revalidate = 0

export default async function Home() {
    return (
        <div className="container py-4">
            <div className="row g-4">
                <Suspense fallback={<Loader />}><Racek /></Suspense>
                <Suspense fallback={<Loader />}><Opice /></Suspense>
                <Suspense fallback={<Loader />}><Klub /></Suspense>
                <Suspense fallback={<Loader />}><Nepal /></Suspense>
            </div>
        </div>
    )
}
