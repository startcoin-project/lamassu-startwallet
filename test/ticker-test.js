/*
* THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
* WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
* OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT,
* INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
* SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
* HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
* STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
* IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
* POSSIBILITY OF SUCH DAMAGE.
*/

'use strict';

var test = require('tap').test;
var ticker = require('../lib/index').ticker;

test('Read ticker from StartWallet', function(t){
  var startwallet = new ticker();
  startwallet.ticker(function(err, result) {
    t.plan(5);
    t.equal(err, null, 'There should be no error');
    t.notEqual(result, null, 'There should be a result');
    t.equal(result.error, undefined, 'The result should contain no error');
    t.notEqual(result["USD"], undefined, 'A rate should have been returned');
    t.ok(parseFloat(result["USD"], 10), 'The rate should be a float');
    t.end();
  });
});

