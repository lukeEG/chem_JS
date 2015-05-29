/**
 * jspsych-survey-text-table
 * a jspsych plugin for free response survey questions in table format
 *
 * Spencer Chu
 * 
 * Based on jspsych-survey-text created by Josh de Leeuw as part of jsPsych
 *
 */

(function($) {
    jsPsych['survey-text-table'] = (function() {

        var plugin = {};

        plugin.create = function(params) {

            params = jsPsych.pluginAPI.enforceArray(params, ['data']);

            var trials = [];
            for (var i = 0; i < params.questions.length; i++) {
                trials.push({
                    questions: params.questions[i]
                });
            }
            return trials;
        };

        plugin.trial = function(display_element, trial) {

            // if any trial variables are functions
            // this evaluates the function and replaces
            // it with the output of the function
            trial = jsPsych.pluginAPI.normalizeTrialVariables(trial);

            // add likert scale questions
            for (var i = 0; i < trial.questions.length; i++) {
                // create div
                display_element.append($('<div>', {
                    "id": 'jspsych-survey-text-table-' + i,
                    "class": 'jspsych-survey-text-table-question'
                }));

                // add question text and input text box
                $("#jspsych-survey-text-table-" + i).append('<table><tr><td class="stimulus" width=700>' + trial.questions[i] + '</td><td class="text-response"><input type="text" name="#jspsych-survey-text-table-response-' + i + '"></input></td></tr>');
               
            }

            // add submit button
            display_element.append($('<button>', {
                'id': 'jspsych-survey-text-table-next',
                'class': 'jspsych-survey-text-table'
            }));
            $("#jspsych-survey-text-table-next").html('Submit Answers');
            $("#jspsych-survey-text-table-next").click(function() {
                // measure response time
                var endTime = (new Date()).getTime();
                var response_time = endTime - startTime;

                // create object to hold responses
                var question_data = {};
                $("td.text-response").each(function(index) {
                    var id = "Q" + index;
                    var val = $(this).children('input').val();
                    var obje = {};
                    obje[id] = val;
                    $.extend(question_data, obje);
                });
               

                // save data
                jsPsych.data.write($.extend({}, {
                    "rt": response_time,
                    "responses": JSON.stringify(question_data),
                    "stimulus": trial.questions
                }, trial.data));

                display_element.html('');

                // next trial
        				if(trial.timing_post_trial > 0){
                	setTimeout(function(){ jsPsych.finishTrial(); }, trial.timing_post_trial);
        				} else {
        					jsPsych.finishTrial();
        				}
            });

            var startTime = (new Date()).getTime();
        };

        return plugin;
    })();
})(jQuery);
