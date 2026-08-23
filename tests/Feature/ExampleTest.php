<?php

it('redirects root route to dashboard', function () {
    $response = $this->get('/');

    $response->assertRedirect(route('dashboard'));
});
