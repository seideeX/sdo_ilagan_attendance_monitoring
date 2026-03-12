<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class FingerprintController extends Controller
{
    public function test()
    {
        return Inertia::render('FingerprintTest');
    }
}
